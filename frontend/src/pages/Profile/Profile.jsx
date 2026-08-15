import { useEffect, useMemo, useState } from "react";
import { Card, EmptyState, ErrorState, Spinner } from "../../components/ui/SharedComponents.jsx";
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
      <div className="min-h-screen bg-transparent px-4 py-10 sm:px-6 lg:px-8">
        <Card className="mx-auto flex w-full max-w-4xl items-center justify-center gap-3 p-6 shadow-card sm:p-8">
          <Spinner />
          <span className="text-sm text-text-secondary">Loading profile...</span>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-transparent px-4 py-10 sm:px-6 lg:px-8">
        <Card className="mx-auto w-full max-w-4xl p-6 shadow-card sm:p-8">
          <ErrorState message={error} onRetry={() => window.location.reload()} />
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-transparent px-4 py-10 sm:px-6 lg:px-8">
        <Card className="mx-auto w-full max-w-4xl p-6 shadow-card sm:p-8">
          <EmptyState message="No profile data available right now." />
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent px-4 py-10 sm:px-6 lg:px-8">
      <Card className="mx-auto w-full max-w-4xl p-6 shadow-card sm:p-8">
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold text-text-primary">{user.username}</h1>
          <p className="text-sm text-text-secondary">{user.email}</p>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-border-subtle/80 bg-bg-surface/70 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-text-secondary">Total Submissions</p>
              <p className="mt-2 text-2xl font-semibold text-text-primary">{totalSubmissions}</p>
            </div>
            <div className="rounded-2xl border border-border-subtle/80 bg-bg-surface/70 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-text-secondary">Accepted</p>
              <p className="mt-2 text-2xl font-semibold text-verdict-accepted">{acceptedCount}</p>
            </div>
            <div className="rounded-2xl border border-border-subtle/80 bg-bg-surface/70 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-text-secondary">Problems Solved</p>
              <p className="mt-2 text-2xl font-semibold text-accent-primary">{uniqueProblemsSolved}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Profile;