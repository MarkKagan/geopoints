import { PrismaClient } from '@prisma/client';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { List, User } from '../../../types/types';
import PictureTitleAndDesc from '../../../components/PictureTitleAndDesc';
import PointUnderList from '../../../components/PointUnderList';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useUserData } from '../../../hooks/useUserData';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { Button } from '@material-tailwind/react';
import { useState, } from 'react';

const prisma = new PrismaClient();

function List({ listData, listOwner }: { listData: List; listOwner: User }) {
  const { user } = useUser();
  const { isError, isLoading, error, data } = useUserData(user!);

  const [liked, setLiked] = useState(false);

  data && listData && handleIfLiked(data.id, listData.id!)
    .then((res) => {
      console.log(res)
      setLiked(res.isLiked)
    })

  // console.log('Data: ', data)
  // console.log('ListData: ', listData)

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError && error instanceof Error) {
    return <span className="text-black">Error: {error.message}</span>;
  }

  return (
      listData && data && (
        <div className="flex flex-col mt-8 mb-20">
          <PictureTitleAndDesc
            imagePath={listData?.imagePath}
            description={listData?.description}
            title={listData?.title}
            points={listData.points}
          />
          {data.id == listData.authorId ? (
            <Button className="fixed bottom-20 right-4"
              // onClick={() => {
                //delete list function
              // }}
            >
              Delete List
            </Button>
            ) : liked ? (
              <Button
                onClick={() => {
                  handleToggleFavourites(data.id, listData.id!, liked)
                  setLiked(false)
                }}
              >
                Liked
              </Button>
            ) : (
              <Button className="fixed bottom-20 right-4"
                onClick={() => {
                  handleToggleFavourites(data.id, listData.id!, liked)
                  setLiked(true)
                }}
              >
                Like
              </Button>
            )
          }
        </div>
      )
  );
}

const handleToggleFavourites = async (userId: Number, listId: Number, liked: Boolean) => {
  const response = await fetch('/api/lists/favourite', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ userId: userId, listId: listId, liked: liked })
  })
  const data = await response.json()
  // console.log(data)
}

const handleIfLiked = async (userId: Number, listId: Number) => {
  const response = await fetch('/api/lists/checkIfLiked', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ userId: userId, listId: listId })
  })
  const data = await response.json()
  // console.log(data)
  return data;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const userName = context.query.userName;
  const listId = Number(context.query.listId);

  let listData = await prisma.list.findUnique({
    where: { id: listId },
    include: {
      points: true,
      tags: true,
      likedBy: true,
    },
  });

  let listOwner;
  if (userName && typeof userName === 'string') {
    listOwner = await prisma.user.findUnique({
      where: { userName },
      include: {
        ownLists: true,
        likedLists: true,
        likedPoints: true,
      },
    });
  }

  listData = JSON.parse(JSON.stringify(listData));
  listOwner = JSON.parse(JSON.stringify(listOwner));
  return {
    props: { listData, listOwner },
  };
};

export default List;
