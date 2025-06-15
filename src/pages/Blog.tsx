
import React, { useEffect } from "react";
import Navbar from "@/components/layout/Navbar";

const blogPosts = [
  {
    title: "Why You Need a Permit for Your New Deck",
    slug: "why-you-need-a-deck-permit",
    content: `
      <p class="mb-4">Building a new deck is an exciting home improvement project, but it comes with responsibilities. One of the most crucial steps is securing a building permit. Many homeowners wonder if this is truly necessary. The short answer is: almost always, yes. This post explores why obtaining a deck permit is non-negotiable for safety, legal, and financial reasons.</p>
      <h3 class="text-2xl font-bold mt-6 mb-3">1. Ensuring Safety</h3>
      <p class="mb-4">The primary reason for deck permits is safety. Your local building department has specific codes for deck construction—covering everything from footing depth and ledger board attachment to railing height and stair dimensions. These codes are in place to prevent structural failures, which can lead to serious injury. A plan review and inspections are part of the permit process, ensuring your deck is built to these minimum safety standards.</p>
      <h3 class="text-2xl font-bold mt-6 mb-3">2. Legal Compliance</h3>
      <p class="mb-4">Building without a permit is illegal. If you're caught, you could face hefty fines, be forced to tear down the deck, or be required to make costly changes to bring it up to code. It's much simpler and cheaper to get the permit from the start.</p>
      <h3 class="text-2xl font-bold mt-6 mb-3">3. Protecting Your Investment</h3>
      <p class="mb-4">A deck is a significant investment that can increase your home's value. However, an unpermitted deck can be a major liability when you decide to sell your home. Prospective buyers' lenders often won't finance a home with unpermitted work. A properly permitted deck, on the other hand, is a valuable asset.</p>
      <h3 class="text-2xl font-bold mt-6 mb-3">The Takeaway on Deck Permit Drawings</h3>
      <p>Don't skip the permit process. The best first step is to get professional deck permit drawings. At PermitDraft Pro, we specialize in creating the detailed plans you need to submit to your local building authority. Our drawings make the permit process smoother, helping you build your dream deck safely and legally.</p>
    `
  },
    {
    title: "Choosing Materials for Your Pergola Permit Drawings",
    slug: "pergola-materials-permit-drawings",
    content: `
      <p class="mb-4">When planning a new pergola, the materials you choose will impact its look, longevity, and what's required for your pergola permit drawings. This guide will help you understand the options.</p>
      <h3 class="text-2xl font-bold mt-6 mb-3">1. Wood</h3>
      <p class="mb-4">Wood is a classic choice, offering a natural and traditional look. Pressure-treated pine is cost-effective, while cedar and redwood offer natural resistance to rot and insects. Your pergola permit drawings will need to specify the type and grade of lumber, as well as connection details.</p>
      <h3 class="text-2xl font-bold mt-6 mb-3">2. Vinyl</h3>
      <p class="mb-4">Vinyl is a low-maintenance option that won't rot, warp, or need painting. It's a durable choice, though the initial cost can be higher than some wood options. Structural requirements for your pergola permit will still need to be detailed in your plans.</p>
      <h3 class="text-2xl font-bold mt-6 mb-3">3. Metal</h3>
      <p class="mb-4">Aluminum and steel pergolas offer a modern, sleek look and are extremely durable. They are strong and can span longer distances than wood. Your permit drawings will need to include specifications on the metal's gauge and connection hardware.</p>
      <h3 class="text-2xl font-bold mt-6 mb-3">Conclusion on Pergola Permits</h3>
      <p>No matter which material you choose, accurate pergola permit drawings are key to a successful project. We can help you create plans that meet code and reflect your design vision, simplifying your pergola permit application.</p>
    `
  },
];

const BlogPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Blog | Deck & Patio Permit Drawings | PermitDraft Pro";
    const metaDescriptionTag = document.querySelector('meta[name="description"]');
    if (metaDescriptionTag) {
        metaDescriptionTag.setAttribute("content", "Explore our blog for expert insights on deck permits, patio designs, pergola construction, and securing permits for your outdoor living projects.");
    }
  }, []);

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-16 bg-zinc-50">
        <div className="container px-4 mx-auto">
          <header className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4">Our Blog</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Insights and advice on outdoor space design, permit drawings for decks, patios, pergolas, and making your outdoor living dreams a reality.
            </p>
          </header>
          
          <div className="max-w-4xl mx-auto space-y-12">
            {blogPosts.map((post) => (
              <article key={post.slug} className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-3xl font-bold mb-4 text-gray-800">
                  {post.title}
                </h2>
                <div 
                  className="prose max-w-none text-gray-600"
                  dangerouslySetInnerHTML={{ __html: post.content }} 
                />
              </article>
            ))}
          </div>

          <div className="text-center mt-16">
            <p className="text-muted-foreground">More articles coming soon!</p>
          </div>
        </div>
      </main>
    </>
  );
};

export default BlogPage;
