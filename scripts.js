const specialNumbers = {
  "999": "Emergency Services",
  "112": "Emergency Services",
  "911": "Emergency Services",
  "01189998819991197253": "Easter Egg",
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
    payg: "15p/min\n5p/text",
    goodybag: "Inclusive"
  },
  landline: {
    payg: "15p/min\n5p/text",
    goodybag: "Inclusive"
  },
  "mobile or landline": {
    payg: "15p/min\n5p/text",
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
    goodybag: "<span class='warn'>Not included</span>"
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
    goodybag: "<span class='warn'>Not included</span>"
  },
  "support helpline": {
    payg: "Free",
    goodybag: "Free"
  },
  pager: {
    payg: "40p/min",
    goodybag: "<span class='warn'>Not included</span>"
  },
  corporate: {
    payg: "20p/min",
    goodybag: "<span class='warn'>Not included</span>"
  },
  "voice over ip (voip)": {
    payg: "8p/min",
    goodybag: "<span class='warn'>Not included</span>"
  },
  "shared cost": {
    payg: "Dependant",
    goodybag: "<span class='warn'>Not included</span>"
  },
  shortcode: {
    payg: "Pricing set by service provider (free to £5)",
    goodybag: "<span class='warn'>Not included</span>"
  },
  "society lottery shortcode": {
    payg: "Pricing set by service provider (free to £5)",
    goodybag: "<span class='warn'>Not included</span>"
  },
  "directory enquiries": {
    payg: "25p/min + service charge",
    goodybag: "<span class='warn'>Not included</span>"
  },
  "giffgaff member services": {
    payg: "Free",
    goodybag: "Free"
  },
  "non-geographical standard rate": {
    payg: "15p/min\n5p/text",
    goodybag: "Inclusive"
  },
  "easter egg": {
    payg: "The IT Crowd",
    goodybag: "The IT Crowd"
  }
};

let InternationalPricing;

fetch("intl-prices.json").then(result =>
  result.json().then(j => (InternationalPricing = j))
);

document.querySelector("main input").focus();

document.querySelector("main input").addEventListener("keydown", function(e) {
  var key = e.keyCode ? e.keyCode : e.which;

  if (
    !(
      [8, 9, 13, 27, 46, 110, 190].indexOf(key) !== -1 ||
      (key == 65 && (e.ctrlKey || e.metaKey)) ||
      (key >= 35 && key <= 40) ||
      (key >= 48 && key <= 57 && !(e.shiftKey || e.altKey)) ||
      (key >= 96 && key <= 105) ||
      event.key === "+"
    )
  )
    e.preventDefault();
});

document.querySelector("main input").addEventListener("input", function(e) {
  if (this.value.replace(" ", "") === "") {
    document.querySelector("section#result").innerHTML =
      "Please enter a phone number";

    document.querySelector("td#payg").innerHTML = "";
    document.querySelector("td#goodybag").innerHTML = "";
    return;
  }

  const numFmt = new libphonenumber.AsYouType("GB");

  let value = this.value;

  if (value.startsWith("00")) {
    value = "+" + value.substr(2);
  }

  this.value = numFmt.input(value);

  a = numFmt.getNumber();

  const num = a ? a.number : "";
  if (!a) {
    document.querySelector("section#result").innerHTML =
      "Please enter a phone number";

    document.querySelector("td#payg").innerHTML = "";
    document.querySelector("td#goodybag").innerHTML = "";
    return;
  }

  delete a;

  const numStr = this.value.replace(/\ /g, "");

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

  if (
    !numStr.startsWith("0") &&
    ((numStr.length === 5 && !numStr.startsWith("+")) ||
      (numStr.length === 8 && numStr.startsWith("+44")))
  ) {
    if (numStr.startsWith("70")) {
      ShowNumberType("Charity Shortcode");
      return;
    } else if (numStr.startsWith("72")) {
      ShowNumberType("Society Lottery Shortcode");
      return;
    } else {
      if (
        numStr.startsWith("6") ||
        numStr.startsWith("8") ||
        numStr.startsWith("7")
      ) {
        if (numStr.startsWith("+44")) ShowNumberType("Shortcode");
        else ShowNumberType("Shortcode");
      }
      return;
    }
  }

  if (numStr.length === 6 && numStr.startsWith("118")) {
    ShowNumberType("directory enquiries");
    return;
  }

  try {
    const NumberInstance = libphonenumber.parsePhoneNumberFromString(num);

    if (
      NumberInstance.nationalNumber.startsWith("116") &&
      NumberInstance.nationalNumber.length === 6
    ) {
      ShowNumberType("Support Helpline");
      return;
    }

    if (NumberInstance.countryCallingCode !== "44") {
      ShowNumberType("International", NumberInstance.country);
      return;
    }

    const type = NumberInstance.getType();

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

    ShowNumberType(
      valueToText[type ? type : typeof type],
      NumberInstance.country
    );
  } catch {}
});

function ShowNumberType(type, country = undefined) {
  if (type === "...") {
    if (country) {
      document.querySelector("section#result").innerHTML =
        "I don't know this number";

      document.querySelector("td#payg").innerHTML = "Unknown";
      document.querySelector("td#goodybag").innerHTML = "Unknown";
    } else {
      document.querySelector("section#result").innerHTML =
        "Please enter more digits";

      document.querySelector("td#payg").innerHTML = "";
      document.querySelector("td#goodybag").innerHTML = "";
    }
  } else if (type === "International") {
    document.querySelector("section#result").innerHTML =
      "This is an <b>" + type.toLowerCase() + "</b> number";

    if (country) {
      const tariff = InternationalPricing["tariffs"][country.toLowerCase()];

      document.querySelector(
        "td#payg"
      ).innerHTML = `${tariff.landline}/min (landline)
      ${tariff.mobile}/min (mobile)
      ${tariff.text}/text`.replace(/(\r\n|\r|\n)/g, "<br/>");

      document.querySelector("td#goodybag").innerHTML =
        "<span class='warn'>Not included</span>";
    } else {
      document.querySelector("td#payg").innerHTML = "I need more of the number";
      document.querySelector("td#goodybag").innerHTML =
        "<span class='warn'>Not included</span>";
    }
  } else {
    document.querySelector("section#result").innerHTML =
      "This is a <b>" + type.toLowerCase() + "</b> number";

    document.querySelector("td#payg").innerHTML = ggPrices[type.toLowerCase()][
      "payg"
    ].replace("\n", "<br/>");
    document.querySelector("td#goodybag").innerHTML =
      ggPrices[type.toLowerCase()]["goodybag"];
  }
}
