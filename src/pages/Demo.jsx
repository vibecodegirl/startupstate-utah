import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Users, MapPin, Zap, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';

export default function Demo() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [videoUrl, setVideoUrl] = useState(null);
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoError, setVideoError] = useState(null);

  // Generate demo video on mount
  useEffect(() => {
    const generateVideo = async () => {
      setVideoLoading(true);
      try {
        const response = await base44.functions.invoke('generateDemoVideo', {});
        if (response.data.success) {
          setVideoUrl(response.data.videoUrl);
        } else {
          setVideoError('Failed to generate video');
        }
      } catch (err) {
        setVideoError('Error generating video');
      }
      setVideoLoading(false);
    };

    generateVideo();
  }, []);

  const slides = [
    {
      title: "Founders: Your Personalized Roadmap",
      subtitle: "3 Clicks to Success",
      icon: Users,
      color: 'from-primary to-green-mid',
      steps: [
        { number: '1', label: 'Sign In', description: 'Select Founder role' },
        { number: '2', label: 'Navigate', description: 'Access your portal' },
        { number: '3', label: 'Execute', description: 'Follow personalized business plan' }
      ],
      highlights: [
        'Tailored roadmap based on your stage',
        'Curated resources for your sector',
        'Track progress step-by-step'
      ],
      backgroundColor: 'bg-gradient-to-br from-green-pale to-white'
    },
    {
      title: "Investors: Find Utah's Best in 1 Click",
      subtitle: "Discover Market-Ready Startups",
      icon: MapPin,
      color: 'from-purple-600 to-purple-700',
      steps: [
        { number: '1', label: 'Explore', description: 'View investor dashboard' }
      ],
      highlights: [
        '$1.96B+ in annual VC deployment',
        '3,500+ active startups',
        'Real-time trending sectors',
        'Instant startup matching'
      ],
      backgroundColor: 'bg-gradient-to-br from-purple-50 to-white'
    },
    {
      title: "Utah: The Standard for Innovation",
      subtitle: "Invest Here. Start Here. Succeed Here.",
      icon: Zap,
      color: 'from-orange-600 to-red-600',
      callout: true,
      highlights: [
        '#1 Economic Outlook (19 consecutive years)',
        '4.5% Real GDP Growth Rate — #1 Nationally',
        'World-class talent pipeline from R1 universities',
        'Strategic geographic advantage',
        'Proven ecosystem of successful exits'
      ],
      backgroundColor: 'bg-gradient-to-br from-orange-50 via-white to-red-50',
      stats: [
        { value: '$1.96B', label: 'VC Investment (2024)' },
        { value: '3,500+', label: 'Active Startups' },
        { value: '#1', label: 'Economic Outlook' }
      ]
    }
  ];

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="min-h-screen pt-20 pb-12 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        {/* Carousel Container */}
        <div className={`relative rounded-3xl overflow-hidden shadow-2xl ${slide.backgroundColor} min-h-[600px] flex flex-col justify-center p-12 md:p-16`}>
          {/* Animated Background Gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${slide.color} opacity-5`} />

          {/* Content */}
          <div className="relative z-10">
            {/* Header with Icon */}
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${slide.color} flex items-center justify-center`}>
                <Icon size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-manrope font-extrabold text-foreground">{slide.title}</h1>
                <p className="text-lg text-muted-foreground mt-2">{slide.subtitle}</p>
              </div>
            </div>

            {/* Slide 1: Founder Journey */}
            {currentSlide === 0 && (
              <div className="space-y-8 mt-8">
                {/* Step Flow */}
                <div className="flex items-center justify-between gap-4 mb-8">
                  {slide.steps.map((step, idx) => (
                    <div key={idx} className="flex-1">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg text-white bg-gradient-to-br ${slide.color} mx-auto mb-3`}>
                        {step.number}
                      </div>
                      <p className="font-semibold text-center text-foreground text-sm">{step.label}</p>
                      <p className="text-xs text-muted-foreground text-center mt-1">{step.description}</p>
                    </div>
                  ))}
                </div>

                {/* Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white/60 backdrop-blur rounded-2xl p-6">
                  {slide.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                      <p className="text-sm text-foreground font-medium">{highlight}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Slide 2: Investor Dashboard */}
            {currentSlide === 1 && (
              <div className="space-y-8 mt-8">
                {/* Single Click Visualization */}
                <div className="flex items-center justify-center gap-4 mb-8">
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center bg-white/80 border-4 border-purple-600 mx-auto mb-4">
                      <span className="text-3xl font-bold text-purple-600">1</span>
                    </div>
                    <p className="font-semibold text-foreground">Click to Access</p>
                  </div>
                  <ChevronRight size={32} className="text-purple-600" />
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center bg-white/80 border-4 border-green-600 mx-auto mb-4">
                      <MapPin size={32} className="text-green-600" />
                    </div>
                    <p className="font-semibold text-foreground">Full Ecosystem</p>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {slide.highlights.map((highlight, idx) => (
                    <div key={idx} className="bg-white/60 backdrop-blur rounded-xl p-4 text-center border border-purple-200/50">
                      <p className="text-2xl font-bold text-purple-600 mb-1">
                        {highlight.split(' ')[0]}
                      </p>
                      <p className="text-xs text-foreground font-medium">{highlight.split(' ').slice(1).join(' ')}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Slide 3: Marketing Initiative */}
            {currentSlide === 2 && (
              <div className="space-y-8 mt-8">
                {/* Demo Video */}
                {videoLoading && (
                  <div className="bg-white/60 backdrop-blur rounded-2xl p-12 flex flex-col items-center justify-center gap-4 min-h-[300px]">
                    <Loader size={40} className="text-orange-600 animate-spin" />
                    <p className="text-foreground font-semibold">Generating demo video...</p>
                  </div>
                )}

                {videoError && (
                  <div className="bg-red-50/60 backdrop-blur rounded-2xl p-8 text-center border border-red-200/50">
                    <p className="text-red-700 font-semibold">{videoError}</p>
                    <p className="text-sm text-red-600 mt-2">Video generation in progress. Refresh to see when ready.</p>
                  </div>
                )}

                {videoUrl && (
                  <div className="bg-black rounded-2xl overflow-hidden shadow-lg">
                    <video
                      controls
                      className="w-full aspect-video"
                      src={videoUrl}
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}

                {!videoUrl && !videoLoading && !videoError && (
                  <div className="bg-white/60 backdrop-blur rounded-2xl p-8 flex flex-col items-center justify-center gap-4 min-h-[300px]">
                    <Play size={48} className="text-orange-600 opacity-60" />
                    <p className="text-foreground font-semibold">Demo video ready</p>
                  </div>
                )}

                {/* Stats Showcase */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {slide.stats.map((stat, idx) => (
                    <div key={idx} className="bg-white/80 backdrop-blur rounded-2xl p-6 border border-orange-200/50 text-center">
                      <p className="text-4xl font-extrabold text-transparent bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text mb-2">
                        {stat.value}
                      </p>
                      <p className="text-sm font-semibold text-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Key Highlights */}
                <div className="bg-white/60 backdrop-blur rounded-2xl p-6 space-y-3">
                  {slide.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-orange-600 to-red-600 shrink-0" />
                      <p className="text-sm font-medium text-foreground">{highlight}</p>
                    </div>
                  ))}
                </div>

                {/* Call to Action */}
                <div className="text-center pt-4">
                  <p className="text-lg font-bold text-transparent bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text">
                    StartupState.com — The Standard for Entrepreneurship
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between mt-8">
          <Button
            onClick={prevSlide}
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-full border-primary/30 text-primary hover:bg-green-pale"
          >
            <ChevronLeft size={20} />
          </Button>

          {/* Slide Indicators */}
          <div className="flex gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-3 rounded-full transition-all ${
                  idx === currentSlide
                    ? 'bg-primary w-8'
                    : 'bg-muted w-3 hover:bg-muted/80'
                }`}
              />
            ))}
          </div>

          <Button
            onClick={nextSlide}
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-full border-primary/30 text-primary hover:bg-green-pale"
          >
            <ChevronRight size={20} />
          </Button>
        </div>

        {/* Slide Counter */}
        <div className="text-center mt-6 text-muted-foreground font-semibold">
          Slide {currentSlide + 1} of {slides.length}
        </div>
      </div>
    </div>
  );
}