import cogoToast from "cogo-toast";

export const responseError = (title: string, request: XMLHttpRequest) => {
  const { hide } = cogoToast.error(JSON.parse(request.responseText).error.message, {
    position: "bottom-center",
    heading: title,
    hideAfter: 20,
    onClick: () => hide !== undefined && hide()
  });
};
