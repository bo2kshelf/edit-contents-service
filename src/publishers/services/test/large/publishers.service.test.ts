import {INestApplication} from '@nestjs/common';
import {Test} from '@nestjs/testing';
import * as faker from 'faker';
import {IDModule} from '../../../../common/id/id.module';
import {IDService} from '../../../../common/id/id.service';
import {Neo4jTestModule} from '../../../../neo4j/neo4j-test.module';
import {Neo4jService} from '../../../../neo4j/neo4j.service';
import {PublishersService} from '../../publishers.service';

describe(PublishersService.name, () => {
  let app: INestApplication;

  let neo4jService: Neo4jService;
  let idService: IDService;

  let publishersService: PublishersService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [Neo4jTestModule, IDModule],
      providers: [IDService, PublishersService],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    neo4jService = module.get<Neo4jService>(Neo4jService);
    idService = module.get<IDService>(IDService);

    publishersService = module.get<PublishersService>(PublishersService);
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    await neo4jService.write(`MATCH (n) DETACH DELETE n`);
  });

  afterAll(async () => {
    await app.close();
  });

  it('to be defined', () => {
    expect(publishersService).toBeDefined();
  });

  describe('create()', () => {
    it.each([
      [
        {name: faker.lorem.words(2)},
        {id: expect.any(String), name: expect.any(String)},
      ],
    ])('生成に成功する %#', async (data, expected) => {
      const actual = await publishersService.create(data);

      expect(actual).toStrictEqual(expected);
    });
  });

  describe('publishedBook()', () => {
    const expectedPublisher = {id: 'publisher1', name: faker.lorem.words(2)};
    const expectedBook = {id: 'book1', title: faker.lorem.words(2)};

    beforeEach(async () => {
      await neo4jService.write(
        `CREATE (n:Publisher) SET n=$expected RETURN *`,
        {expected: expectedPublisher},
      );
      await neo4jService.write(`CREATE (n:Book) SET n=$expected RETURN *`, {
        expected: expectedBook,
      });
    });

    it('正常な動作', async () => {
      const actual = await publishersService.publishedBook({
        publisherId: expectedPublisher.id,
        bookId: expectedBook.id,
      });

      expect(actual.publisherId).toBe(expectedPublisher.id);
      expect(actual.bookId).toBe(expectedBook.id);

      const neo4jResult = await neo4jService.read(
        `
        MATCH (:Publisher {id: $publisherId})-[r: PUBLISHED_BOOK]->(:Book {id: $bookId})
        RETURN *
        `,
        {bookId: expectedBook.id, publisherId: expectedPublisher.id},
      );
      expect(neo4jResult.records).toHaveLength(1);
    });
  });
});
