import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { EntityManager } from '@mikro-orm/postgresql';
import { AvailabilitySlot } from './availability-slot.entity';
import { ScheduleTemplate } from '../schedule-templates/schedule-template.entity';
import { Trainer } from '../trainers/trainer.entity';

@Injectable()
export class AvailabilitySlotsGeneratorService {
  private readonly logger = new Logger(AvailabilitySlotsGeneratorService.name);

  constructor(private readonly em: EntityManager) {}

  @Cron('15 0 * * *')
  async handleCron(): Promise<void> {
    this.logger.log('Starting availability slots generation job');
    await this.generate();
    this.logger.log('Availability slots generation job completed');
  }

  async generate(): Promise<void> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await this.deactivatePastSlots(today);

    const trainers = await this.em.find(Trainer, {});
    for (const trainer of trainers) {
      await this.generateForTrainer(trainer, today);
    }
  }

  private async deactivatePastSlots(today: Date): Promise<void> {
    const todayStr = this.formatDate(today);
    const count = await this.em.nativeUpdate(
      AvailabilitySlot,
      { date: { $lt: todayStr }, active: true },
      { active: false },
    );
    if (count > 0) {
      this.logger.log(`Deactivated ${count} past availability slots`);
    }
  }

  private async generateForTrainer(
    trainer: Trainer,
    today: Date,
  ): Promise<void> {
    const templates = await this.em.find(ScheduleTemplate, {
      trainer: trainer.id,
      active: true,
    });

    if (templates.length === 0) {
      return;
    }

    const templatesByDay = new Map<number, ScheduleTemplate[]>();
    for (const template of templates) {
      const day = template.weekDay;
      if (!templatesByDay.has(day)) {
        templatesByDay.set(day, []);
      }
      templatesByDay.get(day)!.push(template);
    }

    const todayStr = this.formatDate(today);
    const existingSlots = await this.em.find(AvailabilitySlot, {
      trainer: trainer.id,
      date: { $gte: todayStr },
      active: true,
    });

    const existingSet = new Set(
      existingSlots.map((s) => `${s.date}|${s.startTime}`),
    );

    let created = 0;

    for (let i = 0; i < trainer.slotGenerationDays; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      const isoWeekDay = this.toIsoWeekDay(date.getDay());
      const dayTemplates = templatesByDay.get(isoWeekDay);
      if (!dayTemplates) {
        continue;
      }

      const dateStr = this.formatDate(date);

      for (const template of dayTemplates) {
        const slots = this.splitIntoSlots(template);
        for (const slot of slots) {
          const key = `${dateStr}|${slot.startTime}`;
          if (existingSet.has(key)) {
            continue;
          }
          this.em.create(AvailabilitySlot, {
            trainer,
            date: dateStr,
            startTime: slot.startTime,
            endTime: slot.endTime,
            active: true,
            booked: false,
          });
          existingSet.add(key);
          created++;
        }
      }
    }

    if (created > 0) {
      await this.em.flush();
      this.logger.log(`Created ${created} slots for trainer ${trainer.id}`);
    }
  }

  private splitIntoSlots(
    template: ScheduleTemplate,
  ): { startTime: string; endTime: string }[] {
    const slots: { startTime: string; endTime: string }[] = [];
    const startMinutes = this.timeToMinutes(template.startTime);
    const endMinutes = this.timeToMinutes(template.endTime);
    const block = template.blockTime;

    let current = startMinutes;
    while (current + block <= endMinutes) {
      slots.push({
        startTime: this.minutesToTime(current),
        endTime: this.minutesToTime(current + block),
      });
      current += block;
    }

    return slots;
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private minutesToTime(minutes: number): string {
    const h = Math.floor(minutes / 60)
      .toString()
      .padStart(2, '0');
    const m = (minutes % 60).toString().padStart(2, '0');
    return `${h}:${m}`;
  }

  /** Convert JS Date.getDay() (0=Sun) to ISO weekday (1=Mon..7=Sun) */
  private toIsoWeekDay(jsDay: number): number {
    return jsDay === 0 ? 7 : jsDay;
  }

  private formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}
