import React from 'react'
import { Box, Heading, Container } from '@chakra-ui/react';
import NotificationsCall from './notifications-call';
import OptionsCall from './options-call';
import VideoPlayer from './video-player';

function VideoSection() {
  return (


        <Box>
        <Container maxW="1200px" mt="8">
        <Heading as="h2" size="2xl"> Video call section   </Heading>
        <VideoPlayer />
        <OptionsCall />
        <NotificationsCall />
        </Container>
    </Box>

  )
}

export default VideoSection