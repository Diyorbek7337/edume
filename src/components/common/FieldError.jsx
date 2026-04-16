const FieldError = ({ error }) => {
  if (!error) return null;
  return <p className="mt-1 text-xs text-red-600">{error}</p>;
};

export default FieldError;
