
import { array, object, string, map, TypeOf } from 'zod';

const ComponentSchema = object({
  name: string({
    required_error: 'resume name is required'
  }),
  component: string({
    required_error: 'component name is required'
  }),
  variables: object({}).catchall(string())
});

export const ResumeRequestSchema = object({
  body: object({
    components: array(ComponentSchema).min(1, 'need to provide at least 1 component for resume')
  })
});

export type ResumeRequestInput = TypeOf<typeof ResumeRequestSchema>;

export const GenerateResumeSchema = object({
  params: object({
    id: string({
      required_error: 'id is required'
    }),
    theme: string().default('default')
  })
});

export type GenerateResumeInput = TypeOf<typeof GenerateResumeSchema>;

export const GetResumeSchema = object({
  params: object({
    id: string ({
      required_error: 'id is required'
    })
  })
});

export type GetResumeInput = TypeOf<typeof GetResumeSchema>;