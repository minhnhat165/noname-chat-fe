import { BaseEntity } from './base-entity';
import { User } from './user';

export type ReportType = 'spam' | 'inappropriate' | 'other';
export type Report = {
  type: ReportType;
  description: string;
  reporter: User;
  reported: User;
} & BaseEntity;
