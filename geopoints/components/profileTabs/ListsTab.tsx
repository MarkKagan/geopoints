import React from "react";
import Link from "next/link";
import RouteToListAuthor from "../RouteToListAuthor/RouteToListAuthor";

import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";

interface ListTabProps {
  imagePath: string;
  title: string;
  description: string;
  listId: number;
  userName: string;
}

const ListTab = ({
  imagePath,
  title,
  description,
  listId,
  userName,
}: ListTabProps) => {
  return (
    <div>
      
      <Link href={`../${userName}/lists/${listId}`}>
        <Card className="w-96 mt-10 mb-10 bg-amber-50">
          <CardHeader color="blue" className="relative h-56">
            <img
              src={imagePath || process.env.NEXT_PUBLIC_DEFAULT_IMAGE}
              alt="img-blur-shadow"
              className="h-full w-full"
            />
          </CardHeader>
          <CardBody className="text-center">
            <Typography variant="h5" className="mb-2">
              {title ? title : "Untitled"}
            </Typography>
            <Typography>
              {description ? description : "No description"}
            </Typography>
          </CardBody>
        </Card>
      </Link>

      <div className="relative bottom-20 left-5">
        <RouteToListAuthor userName={userName} />
      </div>
    </div>
  );
};

export default ListTab;
