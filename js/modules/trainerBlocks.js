const elements = element;
const ls = window.localStorage;
const trnr = ls.getItem("trainerMode");

console.log(trnr);
if (trnr == "1") {
  try {
    return element.getElementsByTagName("div")[1].innerHTML;
  } catch (e) {
    return "";
  }
} else {
  return element.getElementsByTagName("div")[0].innerHTML;
}
