import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { AUTH_MAIL_QUEUE, AuthMailJobs } from '../constants/auth-jobs.enum';

@Processor(AUTH_MAIL_QUEUE)
export class AuthMailProcessor extends WorkerHost {
  private readonly logger = new Logger(AuthMailProcessor.name);

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(`[Job ${job.id}] Started processing: ${job.name}`);

    switch (job.name) {
      case AuthMailJobs.SEND_WELCOME_EMAIL: {
        const { email, name } = job.data;

        this.logger.log(`Sending welcome email to ${name} (${email})...`);

        await new Promise((resolve) => setTimeout(resolve, 3000));

        this.logger.log(`Welcome email successfully sent to ${email}`);
        return { success: true, recipient: email };
      }

      default:
        this.logger.warn(`Unknown job name: ${job.name}`);
        break;
    }
  }
}
