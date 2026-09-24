import { motion } from "framer-motion";

const VARIANTS = {
  primary: "bg-indigo-500 text-white hover:bg-indigo-600 disabled:bg-gray-200 disabled:text-gray-400",
  secondary: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 disabled:opacity-50",
  danger: "bg-red-500 text-white hover:bg-red-600 disabled:bg-gray-200 disabled:text-gray-400",
  ghost: "bg-transparent text-gray-500 hover:bg-gray-100 disabled:opacity-50",
};

const SIZES = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-2.5 text-base",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  icon,
  onClick,
  disabled,
  type = "button",
  className = "",
}) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: 0.96 }}
      className={`inline-flex items-center justify-center gap-1.5 rounded-full font-medium transition-colors ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
    >
      {icon}
      {children}
    </motion.button>
  );
}