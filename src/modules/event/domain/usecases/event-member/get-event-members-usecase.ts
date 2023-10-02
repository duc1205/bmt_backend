import { EventMemberModel } from '../../model/event-member-model';
import { EventMemberRepository } from '../../repositories/event-member-repository';
import { EventModel } from '../../model/event-model';
import { Injectable } from '@nestjs/common';
import { PageList } from 'src/core/models/page-list';
import { PaginationParams } from 'src/core/models/pagination-params';
import { SortParams } from 'src/core/models/sort-params';

@Injectable()
export class GetEventMembersUsecase {
  constructor(private readonly eventMemberRepository: EventMemberRepository) {}

  async call(
    paginationParams: PaginationParams,
    sortParams: SortParams,
    event: EventModel,
    relations: string[] | undefined,
  ): Promise<PageList<EventMemberModel>> {
    return await this.eventMemberRepository.list(paginationParams, sortParams, event, relations);
  }
}
