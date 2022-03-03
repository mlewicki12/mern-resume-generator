
import mongoose from 'mongoose'
import { KeyValues } from '../utilities/types';

export interface ResumeComponent {
  // zod is being weird woo
  component?: string;
  variables?: KeyValues<string>;
}

export interface ResumeDocument extends mongoose.Document {
  name?: string;

  // not necessarily what i'd like it to be, but it should never be undefined
  components?: ResumeComponent[];
  theme?: string;

  createdAt: Date;
  updatedAt: Date;
}

const resumeSchema = new mongoose.Schema({
  theme: { type: String, default: () => 'default' },
  // could use a schema for this, but the keys could be anything depending on a theme, so idk
  // if i end up storing jobs/components in the db on their own for import, it'd be worth making a component schema
  components: { type: [ mongoose.Schema.Types.Mixed ], default: () => [] as any[] },
  name: { type: String, default: () => 'unnamed' }
}, {
  timestamps: true
});

const ResumeModel = mongoose.model<ResumeDocument>('Resume', resumeSchema);
export default ResumeModel;