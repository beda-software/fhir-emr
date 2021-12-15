import React from "react";
import classNames from "classnames";

import "./styles.scss";

interface ButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  variant?: "primary" | "secondary";
}

export function Button(props: ButtonProps) {
  const {
    variant = "primary",
    className,
    onClick,
    disabled: originalDisabled,
    ...other
  } = props;

  const [isLoading, setIsLoading] = React.useState(false);

  const disabled = originalDisabled || isLoading;

  return (
    <button
      type="button"
      className={classNames("app-button", `_${variant}`, className)}
      disabled={disabled}
      onClick={async (event) => {
        if (!onClick) {
          return;
        }

        setIsLoading(true);
        await onClick(event);
        setIsLoading(false);
      }}
      {...other}
    />
  );
}
