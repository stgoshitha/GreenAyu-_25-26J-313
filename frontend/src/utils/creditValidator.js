import API from "../services/api";
import Swal from "sweetalert2";

/**
 * Validates and deducts credits for an AI task.
 * @param {Object} auth - The auth context object.
 * @param {string} taskName - Name of the task for logging/alerting.
 * @returns {Promise<boolean>} - True if deduction successful, false otherwise.
 */
export const validateAndDeductCredits = async (auth, taskName = "AI Analysis") => {
  if (!auth?.user) return false;

  const COST = 20;

  // 1. Initial frontend check to save a network call
  if (auth.user.tokens < COST) {
    Swal.fire({
      icon: "error",
      title: "Insufficient Credits",
      text: `This feature requires ${COST} credits. You currently have ${auth.user.tokens} credits.`,
      confirmButtonText: "Buy Credits",
      confirmButtonColor: "#22c55e",
      showCancelButton: true,
      cancelButtonText: "Later"
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "/packages";
      }
    });
    return false;
  }

  // 2. Official backend deduction
  try {
    const res = await API.post("/transactions/analyze", {
      type: taskName,
      credits: COST
    });

    if (res.data.success) {
      // 3. Update the frontend auth state with new balance
      auth.updateUser({
        ...auth.user,
        tokens: res.data.remainingTokens
      });
      return true;
    } else {
      throw new Error(res.data.message || "Failed to deduct credits");
    }
  } catch (err) {
    console.error("Credit deduction error:", err);
    Swal.fire({
      icon: "error",
      title: "Transaction Failed",
      text: err.response?.data?.message || "Could not process credit deduction. Please try again.",
      confirmButtonColor: "#22c55e",
    });
    return false;
  }
};
