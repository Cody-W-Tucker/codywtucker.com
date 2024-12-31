import { BlogPosts } from "app/components/posts";

export default function Page() {
  return (
    <section className="prose dark:prose-invert">
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        Cody Tucker
      </h1>
      <p>
        {`I am an AI Researcher and modern philosopher exploring the intricate relationship between technological advancement and human development.`}
      </p>
      <p>
        {`My work spans the intersection of artificial intelligence, business
        optimization, and societal evolution, with a focus on creating systems
        that enhance human capabilities while maintaining our essential
        humanity.`}
      </p>

      <h2>Current Projects</h2>
      <BlogPosts />
    </section>
  );
}
