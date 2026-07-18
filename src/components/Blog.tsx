import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, User, ArrowRight, X } from 'lucide-react';

interface Blog {
  id: string;
  title: string;
  excerpt: string | null;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  author: { name: string } | null;
}

const Blog = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data, error } = await (supabase as any)
          .from('blogs')
          .select(`
            id, title, excerpt, content, imageUrl, createdAt,
            author:User(name)
          `)
          .eq('published', true)
          .order('createdAt', { ascending: false })
          .limit(3);

        if (!error && data) {
          // Flatten author name since Supabase returns it as an array if not a single relation, but Prisma relation is a single user
          const formattedData = data.map((b: any) => ({
            ...b,
            author: Array.isArray(b.author) ? b.author[0] : b.author
          }));
          setBlogs(formattedData);
        }
      } catch (err) {
        console.error('Error fetching blogs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const featuredBlog = blogs[0];
  const sideBlogs = blogs.slice(1, 3);

  // Fallback data if no blogs exist
  const hasBlogs = blogs.length > 0;
  
  if (loading) {
    return (
      <section id="blog" className="py-20 bg-background border-t border-border/40">
        <div className="max-w-7xl mx-auto px-4 text-center">Loading articles...</div>
      </section>
    );
  }

  return (
    <section id="blog" className="py-20 bg-background border-t border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Latest Blog & News</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Stay updated with current real estate market trends, property guides, and local news.
          </p>
        </div>

        {hasBlogs ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Featured Article */}
            <Card className="lg:col-span-2 overflow-hidden border-border bg-card shadow-sm hover:shadow-md transition-all flex flex-col justify-between rounded-2xl">
              <CardContent className="p-0 flex flex-col h-full justify-between">
                <div>
                  <div className="h-72 overflow-hidden relative bg-muted">
                    <img 
                      src={featuredBlog.imageUrl || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800"} 
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
                        <span>{new Date(featuredBlog.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-accent" />
                        <span>{featuredBlog.author?.name || 'Admin'}</span>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-4 hover:text-accent transition-colors">
                      {featuredBlog.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-6 line-clamp-3">
                      {featuredBlog.excerpt || featuredBlog.content.substring(0, 150) + '...'}
                    </p>
                  </div>
                </div>
                <div className="px-8 pb-8">
                  <button onClick={() => setSelectedBlog(featuredBlog)} className="text-accent font-semibold flex items-center gap-2 hover:gap-3 transition-all hover:text-accent-hover">
                    Read Full Article <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Sidebar Articles */}
            <div className="flex flex-col gap-8">
              {sideBlogs.map((article) => (
                <Card key={article.id} className="overflow-hidden border-border bg-card shadow-sm hover:shadow-md transition-all flex flex-col justify-between rounded-2xl">
                  <CardContent className="p-0 flex flex-col h-full justify-between">
                    <div>
                      <div className="h-40 overflow-hidden relative bg-muted">
                        <img src={article.imageUrl || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600"} alt={article.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-accent" /> {new Date(article.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="font-bold text-lg text-foreground mb-2 hover:text-accent transition-colors line-clamp-2">
                          {article.title}
                        </h4>
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                          {article.excerpt || article.content.substring(0, 80) + '...'}
                        </p>
                      </div>
                    </div>
                    <div className="px-6 pb-6">
                      <button onClick={() => setSelectedBlog(article)} className="text-accent font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                        Read More <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-10 bg-muted/50 rounded-2xl border border-dashed border-border">
            No articles published yet. Check back soon!
          </div>
        )}
      </div>

      {/* Blog Details Modal */}
      {selectedBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm z-[100]" onClick={() => setSelectedBlog(null)}>
          <div 
            className="bg-card w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl relative"
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedBlog(null)}
              className="absolute top-4 right-4 p-2 bg-background/50 hover:bg-background rounded-full transition-colors z-10"
            >
              <X className="h-5 w-5 text-foreground" />
            </button>
            
            <div className="h-64 sm:h-80 relative overflow-hidden bg-muted">
              <img 
                src={selectedBlog.imageUrl || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800"} 
                alt={selectedBlog.title} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="p-8 sm:p-12">
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6 border-b border-border/50 pb-6">
                <div className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full">
                  <Calendar className="h-4 w-4 text-accent" />
                  <span>{new Date(selectedBlog.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full">
                  <User className="h-4 w-4 text-accent" />
                  <span>{selectedBlog.author?.name || 'Admin'}</span>
                </div>
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-8 leading-tight">
                {selectedBlog.title}
              </h2>
              
              {selectedBlog.excerpt && (
                <p className="text-xl text-muted-foreground mb-8 italic border-l-4 border-accent pl-6 py-2">
                  {selectedBlog.excerpt}
                </p>
              )}
              
              <div className="prose prose-lg dark:prose-invert max-w-none prose-a:text-accent prose-img:rounded-xl">
                {/* Simple rendering for now, could use a markdown parser if needed */}
                {selectedBlog.content.split('\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-4 text-foreground/90 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Blog;
