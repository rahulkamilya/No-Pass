import React from "react";
import { ShieldCheck, CreditCard } from "lucide-react";

interface EmptyStateProps {
  type: "passwords" | "cards";
}

const EmptyState = ({ type }: EmptyStateProps) => {
  return (
    <div className="text-center py-16 border border-dashed border-gray-200 rounded-lg bg-gray-50/50 animate-fade-in">
      {type === "passwords" ? (
        <ShieldCheck className="mx-auto h-10 w-10 text-vault-purple opacity-40 mb-3" />
      ) : (
        <CreditCard className="mx-auto h-10 w-10 text-vault-purple opacity-40 mb-3" />
      )}
      <h3 className="text-lg font-medium text-gray-700 mb-1">No {type} yet</h3>
      <p className="text-sm text-gray-500 max-w-xs mx-auto">
        {type === "passwords"
          ? "Add your first password to securely store your login credentials"
          : "Add your first credit card to securely store your payment information"}
      </p>
    </div>
  );
};

export default EmptyState;
