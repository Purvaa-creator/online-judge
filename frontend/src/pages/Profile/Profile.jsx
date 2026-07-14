import { useEffect, useMemo, useState } from "react";
import { getCurrentUser } from "../../services/authService.js";
import { getMySubmissions } from "../../services/submissionService.js";

function Profile() {
  const [user, setUser] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const [currentUser, mySubmissions] = await Promise.all([
          getCurrentUser(),
          getMySubmissions(),
        ]);

        if (isMounted) {
          setUser(currentUser ?? null);
          setSubmissions(Array.isArray(mySubmissions) ? mySubmissions : []);
        }
      } catch (profileError) {
        const backendMessage =
          profileError?.response?.data?.message ||
          profileError?.message ||
          "Failed to load profile.";

        if (isMounted) {
          setError(backendMessage);
          setUser(null);
          setSubmissions([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const { totalSubmissions, acceptedCount, uniqueProblemsSolved } = useMemo(() => {
    const total = submissions.length;
    const acceptedSubmissions = submissions.filter(
      (submission) => submission?.verdict === "Accepted"
    );
    const accepted = acceptedSubmissions.length;
    const solvedProblems = new Set(
      acceptedSubmissions.map((submission) => submission?.problem_id)
    );

    return {
      totalSubmissions: total,
      acceptedCount: accepted,
      uniqueProblemsSolved: solvedProblems.size,
    };
  }, [submissions]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
          <p className="text-sm text-slate-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
          <p className="text-sm text-slate-600">Failed to load profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold text-slate-900">{user.username}</h1>
          <p className="text-sm text-slate-600">{user.email}</p>
          <p className="text-xs text-slate-500">
            Total Submissions: {totalSubmissions} · Accepted: {acceptedCount} · Problems Solved: {uniqueProblemsSolved}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Profile;