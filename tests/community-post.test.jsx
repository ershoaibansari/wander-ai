import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CommunityPostCard } from "@/components/CommunityPostCard";
import { getDemoCommunityPosts } from "@/lib/demo-data";

describe("Community post card", () => {
  it("renders a post and lets the user like it", () => {
    const post = getDemoCommunityPosts()[0];
    render(<CommunityPostCard post={post} />);
    expect(screen.getByText(post.title)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: new RegExp(`like ${post.title}`, "i") }));
    expect(screen.getByText(new RegExp(`Liked · ${post.likeCount + 1}`))).toBeInTheDocument();
  });

  it("opens comments and posts a comment", () => {
    const post = getDemoCommunityPosts()[0];
    render(<CommunityPostCard post={post} />);
    fireEvent.click(screen.getByRole("button", { name: new RegExp(`comment on ${post.title}`, "i") }));
    expect(screen.getByLabelText(new RegExp(`comments on ${post.title}`, "i"))).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/add a comment/i), {
      target: { value: "This is exactly the kind of local context I needed." },
    });
    fireEvent.click(screen.getByRole("button", { name: "Post" }));
    expect(screen.getByText("This is exactly the kind of local context I needed.")).toBeInTheDocument();
  });
});
