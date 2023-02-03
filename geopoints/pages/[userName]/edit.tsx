import { useUser } from "@auth0/nextjs-auth0/client";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useUserData } from "../../hooks/useUserData";
import React, { useState } from "react";
import UploadWidget from "../../components/UploadWidget";
import { updateUserProfile } from "../../util/updateUserProfile";

import {
  Textarea,
  Input,
  Checkbox,
  Button,
  Card,
  CardBody,
  Typography,
} from "@material-tailwind/react";

function EditProfile(props: any) {
  const { user } = useUser();
  const { isError, isLoading, data, error } = useUserData(user!);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError && error instanceof Error) {
    return <span className="text-black">Error: {error.message}</span>;
  }

  const initialUpdatedInput = {
    id: data.id,
    name: data.name,
    userName: data.userName,
    // isPublic: data?.isPublic,
    bio: data.bio,
    imagePath: data.imagePath,
    facebook: data.facebook,
    instagram: data.instagram,
  };

  const [updatedInput, setUpdatedInput] = useState<any>(initialUpdatedInput);
  const [updateEnabled, setUpdateEnabled] = useState<boolean>(false);
  const [imgUploaded, setImgUploaded] = useState<boolean>(false);
  const [imgPath, setImgPath] = useState<string>("");

  const updateButtonChecker = () => {
    if (!updateEnabled)
      setUpdateEnabled(true);
  };

  const validateEntries =
    updatedInput.name.length > 0 &&
    updatedInput.userName.length > 0 &&
    updatedInput.bio.length > 0;

  const nameUpdateHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateButtonChecker();
    setUpdatedInput({ ...updatedInput, name: e.target.value });
  };
  const usernameUpdateHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateButtonChecker();
    setUpdatedInput({ ...updatedInput, userName: e.target.value });
  };
  const bioUpdateHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateButtonChecker();
    setUpdatedInput({ ...updatedInput, bio: e.target.value });
  };
  // const publicUpdateHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
  // updateButtonChecker();
  //   setUpdatedInput({...updatedInput, isPublic: !isPublic});
  // };

  const editProfileHandler = (e: any) => {
    e.preventDefault();
    const toBeSentUpdatedInfo = {
      name: updatedInput.name,
      userName: updatedInput.userName,
      // isPublic: data?.isPublic,
      bio: updatedInput.bio,
      imagePath: updatedInput.imagePath,
      facebook: updatedInput.facebook,
      instagram: updatedInput.instagram,
    };
    try {
      updateUserProfile(toBeSentUpdatedInfo, data.id);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={editProfileHandler} className="mt-10 m-w-96 flex flex-col">
      <Card className="h-auto w-auto object-contain mx-6 my-6">
        <img src={data.imagePath} alt="profile-picture" className="p-6" />
      </Card>

      <CardBody>
        <div className="my-2">
          <Input
            variant="outlined"
            label="Name"
            placeholder={data.name}
            onChange={nameUpdateHandler}
            required={true}
            maxLength={25}
          />
        </div>
        <div className="my-2">
          <Input
            variant="outlined"
            label="Username"
            placeholder={data.userName}
            onChange={usernameUpdateHandler}
            required={true}
            maxLength={50}
          />
        </div>

        {/* <div className="my-2">
          <Checkbox
          label="Make public"
            checked={data.isPublic === true}
            ripple={true}
            onChange={publicUpdateHandler}
          />
        </div> */}

        <Textarea
          id="Bio"
          name="Bio"
          label="Bio"
          placeholder={data.bio}
          onChange={bioUpdateHandler}
        />

        <Button ripple={true} type="submit" disabled={!(updateEnabled && validateEntries)}>
          Update Profile Info
        </Button>
      </CardBody>
    </form>
  );
}

export default EditProfile;
