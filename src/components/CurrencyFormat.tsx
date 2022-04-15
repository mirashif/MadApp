import React from "react";
import NumberFormat from "react-number-format";

interface CurrencyFormatProps {
  value: string | number | null | undefined;
}

const CurrencyFormat = ({ value }: CurrencyFormatProps) => {
  return (
    <NumberFormat
      displayType="text"
      prefix="৳"
      renderText={(text) => text}
      thousandSeparator
      thousandsGroupStyle="lakh"
      value={value}
    />
  );
};

export default CurrencyFormat;
