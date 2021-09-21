import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationService {
  parentArrived() {
    // get surrogate key from parent

    // retrieve kids of that parent

    // notify through web socket that these kids can be free

    // put this information in the message queue service to be retrieved later if needed
    return { implemented: false };
  }
}
