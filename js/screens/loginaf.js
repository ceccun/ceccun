const appID = new URL(window.location).searchParams.get("app");
const token = new URL(window.location).searchParams.get("token");
const redirect = new URL(window.location).searchParams.get("redirect");

if (appID == null) {
  window.location.replace("/notes");
}

const approveApp = () => {
  window.location.href = `${atob(redirect)}?token=${atob(token)}`;
};
