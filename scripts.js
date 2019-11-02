const specialNumbers = {
  "999": "Emergency Services",
  "112": "Emergency Services",
  "911": "Emergency Services",
  "101": "Police Non-emergency",
  "111": "NHS non-emergency",
  "105": "Powercut emergency",
  "43430": "giffgaff member services",
  "43431": "giffgaff member services",
  "123": "talking clock",
  "118118": "Directory Enquiries"
};

const ggPrices = {
  mobile: {
    payg: "15p/min",
    goodybag: "Inclusive"
  },
  landline: {
    payg: "15p/min",
    goodybag: "Inclusive"
  },
  "mobile or landline": {
    payg: "15p/min",
    goodybag: "Inclusive"
  },
  "giffgaff voicemail": {
    payg: "8p/call",
    goodybag: "1 minute per call"
  },
  freephone: {
    payg: "Free",
    goodybag: "Free"
  },
  personal: {
    payg: "15p/min if starting 070",
    goodybag: "Inclusive if starting 070"
  },
  "premium rate": {
    payg: "25p/min + service charge",
    goodybag: "Not included"
  },
  "emergency services": {
    payg: "Free",
    goodybag: "Free"
  },
  "police non-emergency": {
    payg: "Free",
    goodybag: "Free"
  },
  "nhs 111": {
    payg: "Free",
    goodybag: "Free"
  },
  "talking clock": {
    payg: "15p/call",
    goodybag: "Not included"
  },
  "support helpline": {
    payg: "Free",
    goodybag: "Free"
  },
  pager: {
    payg: "40p/min",
    goodybag: "Not included"
  },
  corporate: {
    payg: "20p/min",
    goodybag: "Not included"
  },
  "voice over ip (voip)": {
    payg: "8p/min",
    goodybag: "Not included"
  },
  "shared cost": {
    payg: "Dependant",
    goodybag: "Not included"
  },
  shortcode: {
    payg: "Free to £5/min (set by service provider)",
    goodybag: "Not included"
  },
  "directory enquiries": {
    payg: "25p/min + service charge",
    goodybag: "Not included"
  },
  "giffgaff member services": {
    payg: "Free",
    goodybag: "Free"
  },
  "non-geographical standard rate": {
    payg: "15p/min",
    goodybag: "Inclusive"
  }
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
    if (["123", "121", "901", "222"].includes(numStr)) {
      ShowNumberType("Mobile network voicemail");
      return;
    } else if (numStr === "443") {
      ShowNumberType("giffgaff voicemail");
      return;
    }
  }

  if (!numStr.startsWith("0") && numStr.length === 5) {
    if (numStr.startsWith("70")) {
      ShowNumberType("Charity Shortcode");
      return;
    } else if (numStr.startsWith("116")) {
      ShowNumberType("Support helpline");
      return;
    } else {
      ShowNumberType("Shortcode");
      return;
    }
  }

  if (numStr.length === 6 && numStr.startsWith("118")) {
    ShowNumberType("directory enquiries");
    return;
  }

  try {
    const type = libphonenumber.parsePhoneNumberFromString(num).getType();

    if (type === "UAN" && numStr.startsWith("03")) {
      ShowNumberType("Non-geographical standard rate");
      return;
    }

    const valueToText = {
      MOBILE: "mobile",
      FIXED_LINE: "landline",
      FIXED_LINE_OR_MOBILE: "mobile or landline",
      PREMIUM_RATE: "premium rate",
      TOLL_FREE: "Freephone",
      SHARED_COST: "Shared Cost",
      VOIP: "Voice over IP (VoIP)",
      PERSONAL_NUMBER: "Personal",
      PAGER: "Pager",
      UAN: "Corporate",
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

    document.querySelector("td#payg").innerHTML = "Unknown";
    document.querySelector("td#goodybag").innerHTML = "Unknown";
  } else {
    document.querySelector("section#result").innerHTML =
      "This is a <b>" + type.toLowerCase() + "</b> number";

    document.querySelector("td#payg").innerHTML =
      ggPrices[type.toLowerCase()]["payg"];
    document.querySelector("td#goodybag").innerHTML =
      ggPrices[type.toLowerCase()]["goodybag"];
  }
}
