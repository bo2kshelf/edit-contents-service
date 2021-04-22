import {INestApplication} from '@nestjs/common';
import {Test} from '@nestjs/testing';
import * as faker from 'faker';
import {IDModule} from '../../../../common/id/id.module';
import {IDService} from '../../../../common/id/id.service';
import {Neo4jTestModule} from '../../../../neo4j/neo4j-test.module';
import {Neo4jService} from '../../../../neo4j/neo4j.service';
import {BooksService} from '../../books.service';

describe(BooksService.name, () => {
  let app: INestApplication;

  let neo4jService: Neo4jService;
  let idService: IDService;

  let booksSerivce: BooksService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [Neo4jTestModule, IDModule],
      providers: [IDService, BooksService],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    neo4jService = module.get<Neo4jService>(Neo4jService);
    idService = module.get<IDService>(IDService);

    booksSerivce = module.get<BooksService>(BooksService);
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    await neo4jService.write(`MATCH (n) DETACH DELETE n`);
  });

  afterAll(async () => {
    await app.close();
  });

  it('to be defined', () => {
    expect(booksSerivce).toBeDefined();
  });

  describe('create()', () => {
    it.each([
      [
        {title: faker.lorem.words(2)},
        {
          id: expect.any(String),
          title: expect.any(String),
        },
      ],
      [
        {title: faker.lorem.words(2), isbn: '9784832272460'},
        {
          id: expect.any(String),
          title: expect.any(String),
          isbn: '9784832272460',
        },
      ],
      [
        {
          title: faker.lorem.words(2),
          subtitle: faker.lorem.words(2),
          isbn: '9784832272460',
        },
        {
          id: expect.any(String),
          title: expect.any(String),
          subtitle: expect.any(String),
          isbn: '9784832272460',
        },
      ],
    ])('生成に成功する %#', async (data, expected) => {
      const actual = await booksSerivce.create(data);

      expect(actual).toStrictEqual(expected);
    });
  });
});
