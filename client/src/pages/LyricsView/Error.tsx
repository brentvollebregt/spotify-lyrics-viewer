import React from "react";
import { Box, Typography } from "@material-ui/core";

const Error: React.FunctionComponent = () => {
  return (
    <Box textAlign="center">
      <Typography variant="h4" gutterBottom>
        Error
      </Typography>

      <Typography>An unexpected error ocurred</Typography>
    </Box>
  );
};

export default Error;
