// lib/prisma.ts
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const NUMBER_OF_FAKE_USERS = 5;

(async () => {
  try {
    await prisma.user.deleteMany();
    console.log('Deleted records in users table');

    await prisma.list.deleteMany();
    console.log('Deleted records in lists table');

    await prisma.point.deleteMany();
    console.log('Deleted records in points table');

    await prisma.tag.deleteMany();
    console.log('Deleted records in tags table');

    for (let i = 0; i < NUMBER_OF_FAKE_USERS; i++) {
      await prisma.user.create({
        data: {
          email: faker.internet.email(),
          userName: faker.internet.userName(),
          name: faker.name.fullName(),
          bio: faker.lorem.sentence(),
          imagePath: faker.image.avatar(),
          ownLists: {
            create: [
              {
                title: 'My Points',
                description: faker.lorem.sentence(),
                imagePath: faker.image.nature(),
                isPublic: true,
                tags: {
                  create: {
                    name: faker.random.word(),
                  },
                },
                points: {
                  create: {
                    title: faker.company.bsNoun(),
                    lng: Number(faker.address.longitude()),
                    lat: Number(faker.address.latitude()),
                    imagePath: faker.image.business(),
                  },
                },
              },
              {
                title: faker.company.bsNoun(),
                description: faker.lorem.sentence(),
                imagePath: faker.image.nature(),
                isPublic: true,
                tags: {
                  create: {
                    name: faker.random.word(),
                  },
                },
                points: {
                  create: {
                    title: faker.company.bsNoun(),
                    lng: Number(faker.address.longitude()),
                    lat: Number(faker.address.latitude()),
                    imagePath: faker.image.business(),
                  },
                },
              },
            ],
          },
        },
      });
    }

    const userThatListWilBeLiked = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        userName: faker.internet.userName(),
        name: faker.name.fullName(),
        bio: faker.lorem.sentence(),
        imagePath: faker.image.avatar(),
        ownLists: {
          create: [
            {
              title: 'Best reading spots',
              description: faker.lorem.sentence(),
              imagePath: faker.image.nature(),
              isPublic: true,
              tags: {
                create: {
                  name: faker.random.word(),
                },
              },
              points: {
                create: {
                  title: faker.company.bsNoun(),
                  lng: Number(faker.address.longitude()),
                  lat: Number(faker.address.latitude()),
                  imagePath: faker.image.business(),
                },
              },
            },
          ],
        },
      },
      include: {
        ownLists: true,
      },
    });

    const listThatWeWantToSave = await prisma.list.findUnique({
      where: {
        id: userThatListWilBeLiked.ownLists[0].id,
      },
    });

    //create user with your email. Set .env to your email.
    const myUser = await prisma.user.create({
      data: {
        email: process.env.MY_EMAIL!,
        userName: faker.internet.userName(),
        name: faker.name.fullName(),
        bio: faker.lorem.sentence(),
        imagePath: faker.image.avatar(),
        ownLists: {
          create: [
            {
              title: 'My Points',
              imagePath: faker.image.nature(),
              points: {
                create: {
                  title: faker.company.bsNoun(),
                  lng: Number(faker.address.longitude()),
                  lat: Number(faker.address.latitude()),
                  imagePath: faker.image.nature(),
                },
              },
            },
            {
              isPublic: true,
              title: faker.company.catchPhrase(),
              description: faker.lorem.sentence(),
              imagePath: faker.image.fashion(),
              tags: {
                create: {
                  name: faker.random.word(),
                },
              },
              points: {
                create: {
                  title: faker.company.bsNoun(),
                  lng: Number(faker.address.longitude()),
                  lat: Number(faker.address.latitude()),
                  imagePath: faker.image.business(),
                },
              },
            },
          ],
        },
        likedLists: {
          connect: {
            id: listThatWeWantToSave?.id,
          },
        },
      },
      include: {
        likedLists: true,
      },
    });
    console.log('Added data ✨');
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();

export default prisma;
