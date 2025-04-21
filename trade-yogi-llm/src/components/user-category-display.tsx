
interface UserCategoryDisplayProps {
  category: string;
}

export const UserCategoryDisplay: React.FC<UserCategoryDisplayProps> = ({
  category,
}) => {
  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Your Investor Category</h2>
      <p className="text-muted-foreground">
        Based on your input, you are categorized as:
      </p>
      <p className="text-2xl font-bold text-primary mt-2">{category}</p>
    </>
  );
};
