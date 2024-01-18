import cogoToast from "cogo-toast";

export const responseError = (title: string, request: XMLHttpRequest) => {
  const { hide } = cogoToast.error(JSON.parse(request.responseText).error.message, {
    position: "bottom-center",
    heading: title,
    hideAfter: 20,
    onClick: () => hide !== undefined && hide()
  });
};

export const formatMilliseconds = (milliseconds: number) => {
  // Convert milliseconds to seconds
  const totalSeconds = Math.floor(milliseconds / 1000);

  // Calculate minutes and seconds
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  // Format the output to "minutes:seconds"
  // Pad the seconds with a leading zero if it's less than 10
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};
