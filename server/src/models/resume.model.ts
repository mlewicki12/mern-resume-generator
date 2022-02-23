
import mongoose from 'mongoose'
import { KeyValues } from '../utilities/types';

export interface ResumeComponent {
  // zod is being weird woo
  component?: string;
  variables?: KeyValues<string>;
}

export interface ResumeDocument extends mongoose.Document {
  // not necessarily what i'd like it to be, but it should never be undefined
  components?: ResumeComponent[];

  createdAt: Date;
  updatedAt: Date;
}

const resumeSchema = new mongoose.Schema({
  theme: { type: String, default: () => 'default' },
  components: { type: [ mongoose.Schema.Types.Mixed ], default: () => {} }
}, {
  timestamps: true
});

const ResumeModel = mongoose.model<ResumeDocument>('Resume', resumeSchema);
export default ResumeModel;