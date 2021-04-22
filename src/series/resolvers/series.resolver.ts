import {Args, Mutation, Resolver} from '@nestjs/graphql';
import {SeriesEntity} from '../entities/series.entity';
import {SeriesService} from '../services/series.service';
import {CreateSeriesArgs} from './dto/create-series.dto';

@Resolver(() => SeriesEntity)
export class SeriesResolver {
  constructor(private readonly seriesService: SeriesService) {}

  @Mutation(() => SeriesEntity)
  async createSeries(
    @Args({type: () => CreateSeriesArgs}) {bookId, ...data}: CreateSeriesArgs,
  ): Promise<SeriesEntity> {
    const seriesId = await this.seriesService.createSeries(bookId, data);
    return {id: seriesId};
  }
}
