import {  Loader, Group, Text } from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { orderBy } from 'lodash';
import React, { useEffect, useState } from 'react';
import { BsImage, BsX } from 'react-icons/bs';
import { FaUpload } from 'react-icons/fa';
import styled from 'styled-components';

import useCanvasContext from '~/context/useCanvasContext';
import useActiveObjectId from '~/store/useActiveObjectId';
import useCanvasObjects from '~/store/useCanvasObjects';
import useDefaultParams from '~/store/useDefaultParams';
import useUnsplashImages from '~/store/useUnsplashImages';
import useUserMode from '~/store/useUserMode';
import fileToBase64 from '~/utils/fileToBase64';
import generateUniqueId from '~/utils/generateUniqueId';
import getDimensionsFromImage from '~/utils/getDimensionsFromImage';
import getImageElementFromUrl from '~/utils/getImageElementFromUrl';
import notification from '~/utils/notification';

import UnsplashImageButton, { type OptionItem } from './UnsplashImageButton';

const GridDiv = styled.div`
  width: 100%;
  pointer-events: auto;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin-top: 10px;
  border: 0.0625rem solid var(--color-borderPrimary);
  border-radius: 0.25rem;
`;

const LoadingDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1rem 0;
`;

interface Props {
  pageSize?: number;
}

export default function ImageControl({ pageSize = 60 }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [visibleImages, setVisibleImages] = useState<number>(pageSize);
  const { contextRef } = useCanvasContext();

  const defaultParams = useDefaultParams((state) => state.defaultParams);
  const setActiveObjectId = useActiveObjectId((state) => state.setActiveObjectId);

  const setUserMode = useUserMode((state) => state.setUserMode);

  const unsplashImagesMap = useUnsplashImages((state) => state.unsplashImagesMap);

  const appendImageObject = useCanvasObjects((state) => state.appendImageObject);

  const imagesToRender = orderBy(Object.values(unsplashImagesMap), ['fetchedAt'], ['desc'])
    //.filter(([slug]) => slug.toLowerCase().includes(searchQuery.toLowerCase()))
    .slice(0, visibleImages);


  useEffect(() => {
    setVisibleImages(pageSize);
  }, [pageSize, defaultParams.searchQueryImages]);

  const pushImageObject = async ({ imageUrl, imageElement, dimensions }: OptionItem) => {
    const createdObjectId = generateUniqueId();
    appendImageObject({
      id: createdObjectId,
      x: 0,
      y: 0,
      width: dimensions.width,
      height: dimensions.height,
      opacity: 100,
      imageUrl,
      imageElement,
    });
    setActiveObjectId(createdObjectId);
    setUserMode('select');
  };

  const hasImages = imagesToRender.length > 0;

  const commonPushImageObject = async (url: string) => {
    const imageElement = await getImageElementFromUrl(url);
    const dimensions = await getDimensionsFromImage({
      context: contextRef?.current,
      imageObject: { x: 0, y: 0, imageElement },
    });
    pushImageObject({ imageUrl: url, imageElement, dimensions });
  };

  return (
    <>
      <Dropzone
        sx={{ marginBottom: '1rem' }}
        accept={IMAGE_MIME_TYPE}
        maxSize={5000000} // 5 mb?
        maxFiles={1}
        multiple={false}
        loading={isLoading}
        onDrop={async (files) => {
          setIsLoading(true);
          try {
            const base64 = await fileToBase64(files[0]);
            if (base64) {
              commonPushImageObject(base64);
            }
          } catch (error) {
            console.error(error);
            notification.error({
              message: (error as Error)?.message,
            });
          }
          setIsLoading(false);
        }}
        onReject={(files) => {
          const message = `Rejected ${files.length} files.`;
          console.error(message, { files });
          notification.error({
            message,
          });
        }}
      >
        <Group position="center" spacing="xs" style={{ pointerEvents: 'none' }}>
          <Dropzone.Accept>
            <FaUpload size="3.2rem" style={{ opacity: 0.35 }} />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <BsX size="3.2rem" style={{ opacity: 0.35 }} />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <BsImage size="3.2rem" style={{ opacity: 0.35 }} />
          </Dropzone.Idle>

          <div>
            <Text size="lg" inline align="center" style={{ opacity: 0.8 }}>
              Drag an image here or click to select a file
            </Text>
            <Text size="sm" inline mt={7} p={3} align="center" style={{ opacity: 0.8 }}>
              File should not exceed 5 MB
            </Text>
          </div>
        </Group>
      </Dropzone>
      {isLoading && (
        <LoadingDiv>
          <Loader />
        </LoadingDiv>
      )}
      {hasImages && !isLoading && (
        <GridDiv>
          {imagesToRender.map((image) => (
            <UnsplashImageButton key={image.id} image={image} pushImageObject={pushImageObject} />
          ))}
        </GridDiv>
      )}
    </>
  );
}
