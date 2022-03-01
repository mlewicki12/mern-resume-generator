
import { array, object, string, map, TypeOf } from 'zod';
import { omit } from 'lodash';

const ComponentSchema = object({
  component: string({
    required_error: 'component name is required'
  }),
  variables: object({}).catchall(string())
});

const payload = {
  body: object({
    name: string({ required_error: 'resume name is required' }),
    components: array(ComponentSchema).min(1, 'need to provide at least 1 component for resume')
  })
}

const params = {
  params: object({
    id: string({
      required_error: 'id is required'
    }),
    theme: string().default('default')
  })
}

export const ResumeRequestSchema = object({
  ...payload
});

export type ResumeRequestInput = TypeOf<typeof ResumeRequestSchema>;

export const GenerateResumeSchema = object({
  ...params
});

export type GenerateResumeInput = TypeOf<typeof GenerateResumeSchema>;

export const UpdateResumeSchema = object({
  ...omit(params, 'theme'),
  ...payload
});

export type UpdateResumeInput = TypeOf<typeof UpdateResumeSchema>;

export const DeleteResumeSchema = object({
  ...omit(params, 'theme')
});

export type DeleteResumeInput = TypeOf<typeof DeleteResumeSchema>;

export const GetResumeSchema = object({
  ...omit(params, 'theme')
});

export type GetResumeInput = TypeOf<typeof GetResumeSchema>;