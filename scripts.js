const specialNumbers = {
  "999": "Emergency Services",
  "112": "Emergency Services",
  "911": "Emergency Services",
  "43430": "giffgaff member services",
  "43431": "giffgaff member services",
  "118118": "Directory Enquiries"
};

document.querySelector("main input").focus();

document.querySelector("main input").addEventListener("keydown", function(e) {
  var key = e.keyCode ? e.keyCode : e.which;

  if (
    !(
      [8, 9, 13, 27, 46, 110, 190].indexOf(key) !== -1 ||
      (key == 65 && (e.ctrlKey || e.metaKey)) ||
      (key >= 35 && key <= 40) ||
      (key >= 48 && key <= 57 && !(e.shiftKey || e.altKey)) ||
      (key >= 96 && key <= 105)
    )
  )
    e.preventDefault();
});

document.querySelector("main input").addEventListener("input", function(e) {
  if (this.value.replace(" ", "") === "") {
    document.querySelector("section#result").innerHTML =
      "Please enter a number...";
    return;
  }

  const numFmt = new libphonenumber.AsYouType("GB");

  this.value = numFmt.input(this.value);

  const num = numFmt.getNumber().number;

  const numStr = this.value.replace(" ", "");

  console.log(numStr);

  if (Object.keys(specialNumbers).includes(numStr)) {
    ShowNumberType(specialNumbers[numStr]);
    return;
  }

  if (numStr.length === 3) {
    if (["443", "123", "121", "901", "222"].includes(numStr)) {
      ShowNumberType("Mobile network voicemail");
      return;
    }
  }

  if (!numStr.startsWith("0") && numStr.length === 5) {
    if (numStr.startsWith("70")) {
      ShowNumberType("Charity Shortcode");
      return;
    } else {
      ShowNumberType("Shortcode");
      return;
    }
  }

  try {
    const type = libphonenumber.parsePhoneNumberFromString(num).getType();

    const valueToText = {
      MOBILE: "Mobile",
      FIXED_LINE: "geographical",
      FIXED_LINE_OR_MOBILE: "Mobile or Geographical",
      PREMIUM_RATE: "Premium Rate",
      TOLL_FREE: "Freephone",
      SHARED_COST: "Shared Cost",
      VOIP: "Voice over IP (VoIP)",
      PERSONAL_NUMBER: "Personal Number",
      PAGER: "Pager",
      UAN: "Universal Account Number (not a phone number)",
      VOICEMAIL: "Voicemail",
      undefined: "..."
    };

    ShowNumberType(valueToText[type ? type : typeof type]);
  } catch {}
});

function ShowNumberType(type) {
  if (type === "...") {
    document.querySelector("section#result").innerHTML =
      "I don't know this number";
  } else {
    document.querySelector("section#result").innerHTML =
      "This is a <b>" + type.toLowerCase() + "</b> number";
  }
}
