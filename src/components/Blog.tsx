import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, User, ArrowRight } from 'lucide-react';

interface BlogContent {
  title: string;
  subtitle: string;
  body: string;
  updatedAt: string;
}

const Blog = () => {
  const [blogData, setBlogData] = useState<BlogContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogContent = async () => {
      try {
        const { data, error } = await (supabase as any)
          .from('Content')
          .select('title, subtitle, body, updatedAt')
          .eq('key', 'blog')
          .eq('isActive', true)
          .single();

        if (!error && data) {
          setBlogData(data);
        }
      } catch (err) {
        console.error('Error fetching blog content:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogContent();
  }, []);

  const defaultArticles = [
    {
      id: '1',
      title: '5 Things to Know Before Buying Land in Kathmandu',
      excerpt: 'Navigating the real estate landscape in Kathmandu can be challenging. Here are 5 critical things to verify before purchasing land...',
      date: 'July 15, 2026',
      author: 'Suman Ghimire',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600'
    },
    {
      id: '2',
      title: 'The Rise of Smart Apartments in Lalitpur',
      excerpt: 'Lalitpur is witnessing a rapid shift towards modern, smart apartment complexes. Explore why young professionals prefer high-rise living...',
      date: 'July 10, 2026',
      author: 'Priya Thapa',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600'
    }
  ];

  return (
    <section id="blog" className="py-20 bg-background border-t border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Latest Blog & News</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Stay updated with current real estate market trends, property guides, and local news.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Featured Article (From Database) */}
          <Card className="lg:col-span-2 overflow-hidden border-border bg-card shadow-sm hover:shadow-md transition-all flex flex-col justify-between rounded-2xl">
            <CardContent className="p-0 flex flex-col h-full justify-between">
              <div>
                <div className="h-72 overflow-hidden relative bg-muted">
                  <img 
                    src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800" 
                    alt="Featured Blog" 
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-4 left-4 bg-accent text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                    Featured
                  </span>
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-accent" />
                      <span>
                        {blogData 
                          ? new Date(blogData.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                          : 'July 18, 2026'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-accent" />
                      <span>Admin</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4 hover:text-accent transition-colors">
                    {blogData?.title || 'Current Property Market Overview in Kathmandu Valley'}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {blogData?.body || 'An analysis of property values, land prices, and rising construction costs in Kathmandu during the third quarter of 2026.'}
                  </p>
                  {blogData?.subtitle && (
                    <blockquote className="border-l-4 border-accent pl-4 italic text-muted-foreground my-4 bg-muted/40 py-2 pr-2 rounded-r-xl">
                      {blogData.subtitle}
                    </blockquote>
                  )}
                </div>
              </div>
              <div className="px-8 pb-8">
                <button className="text-accent font-semibold flex items-center gap-2 hover:gap-3 transition-all hover:text-accent-hover">
                  Read Full Article <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Sidebar Articles */}
          <div className="flex flex-col gap-8">
            {defaultArticles.map((article) => (
              <Card key={article.id} className="overflow-hidden border-border bg-card shadow-sm hover:shadow-md transition-all flex flex-col justify-between rounded-2xl">
                <CardContent className="p-0 flex flex-col h-full justify-between">
                  <div>
                    <div className="h-40 overflow-hidden relative bg-muted">
                      <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-accent" /> {article.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-3.5 w-3.5 text-accent" /> {article.author}
                        </span>
                      </div>
                      <h4 className="font-bold text-lg text-foreground mb-2 hover:text-accent transition-colors line-clamp-2">
                        {article.title}
                      </h4>
                      <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                        {article.excerpt}
                      </p>
                    </div>
                  </div>
                  <div className="px-6 pb-6">
                    <button className="text-accent font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                      Read More <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Blog;
