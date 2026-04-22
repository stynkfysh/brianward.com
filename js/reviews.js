// Reviews data - shuffled and displayed in rotating batches
// Source: Google and Yelp reviews for Brian Ward Appraisal
const allReviews = [
  {
    name: "Brenden Scherr",
    source: "Google",
    year: "2025",
    rating: 5,
    text: "I found Brian after a Google AI assisted search. He was the number one referenced Real Estate Appraiser in Oceanside, California. I can see why now. I needed a quick appraisal and he had availability and a pricing schedule to match my very short term requirements."
  },
  {
    name: "Deana Prest",
    source: "Google",
    year: "2021",
    rating: 5,
    text: "Brian knows the area and is well versed in the real estate market. His knowledge of the current market trends resulted in a higher listing price and ultimately our house sold over asking price. Thank you Brian!"
  },
  {
    name: "Maria Ny",
    source: "Google",
    year: "2021",
    rating: 5,
    text: "Brian Ward is the complete package and more. He is professional, responsive to all correspondence and \u2014 the extra quality \u2014 he\u2019s extremely personable. With Brian, not only are you dealing with a skilled appraiser who is obviously extremely knowledgeable, you are also dealing with someone who genuinely cares."
  },
  {
    name: "Gary McDonald",
    source: "Google",
    year: "2022",
    rating: 5,
    text: "From the beginning Brian was responsive and professional. We reached out to a number of appraisers based on internet reviews. Brian responded almost immediately by phone and text. He made promises in terms of deliverables and met all of them."
  },
  {
    name: "Arenal A.",
    source: "Google",
    year: "2020",
    rating: 5,
    text: "When researching someone who is honest, very responsive to your questions, then Brian is the person to choose. He was very affordable and I received my appraisal report within four days."
  },
  {
    name: "JP Lapeyre",
    source: "Google",
    year: "2019",
    rating: 5,
    text: "Brian was a pleasure to work with. He was responsive before, during, and after our appraisal. He was truly a professional resource and a market expert to help us assess the value of our home in today\u2019s market."
  },
  {
    name: "Barb Yanni",
    source: "Google",
    year: "2019",
    rating: 5,
    text: "NEVER will you meet a more professional, thorough, courteous and intelligent appraiser as Brian Ward. Having bought and sold several properties, I can tell you in no uncertain terms that this guy is the best in his field."
  },
  {
    name: "Willie Bryant",
    source: "Google",
    year: "2020",
    rating: 5,
    text: "The appraisal took about 30\u201345 minutes. He\u2019s thorough and very knowledgeable. I would recommend him to anyone."
  },
  {
    name: "Craig Christopher",
    source: "Google",
    year: "2017",
    rating: 5,
    text: "I am always skeptical of reviews but this time the reviews proved correct. Brian responded to my call within the hour. He gave me an honest and competitive quote. Brian went the extra effort and conducted his site inspection with thoroughness and professionalism."
  },
  {
    name: "ED Properties",
    source: "Google",
    year: "2017",
    rating: 5,
    text: "I\u2019m from out-of-state and all my old friends in SoCal are retired or in hiding. So I went by reviews. What a pleasure to work with Brian. Very Professional and very quick."
  },
  {
    name: "Mishedo Nitsuga",
    source: "Google",
    year: "2017",
    rating: 5,
    text: "A very professional and trustworthy person whom I highly recommend. A highly professional individual whom I wholeheartedly recommend."
  },
  {
    name: "Markus Livingston",
    source: "Google",
    year: "2015",
    rating: 5,
    text: "Brian was highly recommended to me and I am very grateful for the recommendation. It is very simple and smooth to pay for his great services online. He has been outstanding and you get his appraisals for a competitive price."
  },
  {
    name: "Sarah Butler",
    source: "Google",
    year: "2015",
    rating: 5,
    text: "I had contacted a few other businesses but they either never replied to my calls and emails. Brian emailed me back within minutes with the information on process and cost. His website was very informative and easy to navigate."
  },
  {
    name: "Brandy Gaitens",
    source: "Google",
    year: "2014",
    rating: 5,
    text: "Brian Ward is a professional and it was a pleasure working with him. He took the time to understand my appraisal needs and once understood, he worked quickly to get my appraisal complete. He met his timeline and answered emails and texts quickly. He exceeded my expectations."
  },
  {
    name: "Chris Rice",
    source: "Google",
    year: "2013",
    rating: 5,
    text: "I called Brian to schedule an appraisal for my home and he was very responsive and completed the appraisal in a professional manner and in the timeframe that was expected. I would definitely recommend using his services."
  },
  {
    name: "Regina Marler",
    source: "Google",
    year: "2013",
    rating: 5,
    text: "I contacted Brian based on positive reviews others had written about his company. I needed an appraisal very quickly. Brian was kind enough to spend a fair amount of his time looking into my situation and determined that getting a new appraisal would not actually benefit me."
  },
  {
    name: "Brenden S.",
    source: "Yelp",
    location: "Las Vegas, NV",
    year: "2025",
    rating: 5,
    text: "He was the number one referenced Real Estate Appraiser in Oceanside, California. I can see why now. I needed a quick appraisal and he had availability and a pricing schedule to match my very short term requirements. I contacted him and he responded quickly and immediately jumped on the matter and within an hour our business was complete."
  },
  {
    name: "Eric N.",
    source: "Yelp",
    location: "Laguna Beach, CA",
    year: "2025",
    rating: 5,
    text: "Brian was super professional and timely. He used more metrics that I\u2019ve typically seen from other appraisers. His help made me confident of my contract price which allowed me the courage to pull the trigger on the acquisition."
  },
  {
    name: "Cynthia Y.",
    source: "Yelp",
    location: "San Diego, CA",
    year: "2021",
    rating: 5,
    text: "After much research on appraisers for a date of death appraisal of our home, I contacted Brian. From get-go he been very responsive in our communication with him and we especially appreciated receiving our report in a timely manner since we were on a time crunch with our tax attorney."
  },
  {
    name: "Richard H.",
    source: "Yelp",
    location: "Diamond Bar, CA",
    year: "2020",
    rating: 5,
    text: "I needed a DOD Appraisal for a home in San Diego. Brian was quick to respond and handled the appraisal process in a professional manner. We had the finished report within 5 business days. I\u2019m a real estate broker therefore familiar with how an appraisal is done. Brian used the appropriate comps and made a value assessment we thought to be fair."
  },
  {
    name: "Melanie L.",
    source: "Yelp",
    location: "Cottonwood Heights, UT",
    year: "2019",
    rating: 5,
    text: "I work in real estate and needed to service a very important Corporate client with a listing out of state. On a leap of faith I chose Brian. His response time, professionalism, attention to detail, courtesy and even pricing are quite frankly unmatched. You do not need to look any further."
  },
  {
    name: "Brenda C.",
    source: "Yelp",
    location: "Fallbrook, CA",
    year: "2019",
    rating: 5,
    text: "I\u2019ve had many appraisals for homes over the years. Brian has by far created the best appraisal I have ever seen. Not only did he compare similar comps in the area, but he also selected the home most nearly compared to my home and created a detailed report with side by side photo comparisons."
  },
  {
    name: "JP L.",
    source: "Yelp",
    location: "New Orleans, LA",
    year: "2019",
    rating: 5,
    text: "Brian was a pleasure to work with. He was responsive before, during, and after our appraisal. He was truly a professional resource and a market expert to help us assess the value of our home. Not only was he a terrific appraiser, he\u2019s one of the most professional real estate people I\u2019ve ever met."
  },
  {
    name: "Drew G.",
    source: "Yelp",
    location: "San Diego, CA",
    year: "2018",
    rating: 5,
    text: "Brian did an excellent job appraising 2 large vacant parcels in Riverside County. After he submitted the reports, I had several questions and requests for minor changes and he responded very quickly and thoroughly to every request. Brian provided a tremendous amount of useful information above and beyond the appraisals themselves."
  },
  {
    name: "Amanda W.",
    source: "Yelp",
    location: "Encinitas, CA",
    year: "2018",
    rating: 5,
    text: "Brian has done 2 appraisals for us, in 2017 and 2018. We are very pleased with his work. He was professional, communicated quickly, and took into account all factors, looking at everything in detail and relevant in our specific situation. We would highly recommend anyone needing an appraisal to call Brian."
  },
  {
    name: "Laurie K.",
    source: "Yelp",
    location: "Santa Monica, CA",
    year: "2017",
    rating: 5,
    text: "This is as about as good as it gets. Brian\u2019s professionalism and efficiency is rare! I had some very specific needs with complex real-estate holdings after my mother passed away and he walked me through everything I needed to do and made sure I was comfortable with the process."
  },
  {
    name: "Sam V.",
    source: "Yelp",
    location: "Cardiff, CA",
    year: "2017",
    rating: 5,
    text: "Brian does amazing work. He is honest, diligent, and professional. I would recommend him to a family member, no question."
  },
  {
    name: "Dayna V.",
    source: "Yelp",
    location: "Encinitas, CA",
    year: "2017",
    rating: 5,
    text: "He was super helpful. He made a number of suggestions regarding what might help to save us money on the specific appraisal report being required of our unique situation. He was pleasant and very helpful."
  },
  {
    name: "Ellen N.",
    source: "Yelp",
    location: "La Habra, CA",
    year: "2017",
    rating: 5,
    text: "I contacted Brian to get an estimate on an independent home appraisal with rental appraisal, and had an instant response. His price was reasonable. He was on time, very personable, and did a very thorough evaluation. I would definitely recommend Brian!"
  },
  {
    name: "Shirley W.",
    source: "Yelp",
    location: "San Diego, CA",
    year: "2017",
    rating: 5,
    text: "I was referred to Brian by a friend when I needed an appraisal on my home. Brian was a true pro, thorough, answered all of my questions and delivered the appraisal on time. I will refer him without reservation."
  },
  {
    name: "Michelle S.",
    source: "Yelp",
    location: "Poway, CA",
    year: "2019",
    rating: 5,
    text: "Brian truly cares about supporting his clients. He is thorough, patient, and very responsive."
  },
  {
    name: "C D.",
    source: "Yelp",
    location: "San Diego, CA",
    year: "2016",
    rating: 5,
    text: "Sometimes you have to trust the reviews. He returned my call within the hour. He explained what he did and gave me a competitive quote. He completed the appraisal report within his timeline. The report is clean and easy to comprehend. Brian is the appraiser I will be referring."
  },
  {
    name: "Kristen F.",
    source: "Yelp",
    location: "San Diego, CA",
    year: "2015",
    rating: 5,
    text: "Although he was booked, he immediately provided a referral. He took it upon himself to contact the referral on my behalf. It is a true mark of Brian as a professional that he was willing to assist me even when he was not able to do the work himself."
  },
  {
    name: "Lily B.",
    source: "Yelp",
    location: "San Diego, CA",
    year: "2014",
    rating: 5,
    text: "My accountant told me that I needed to get a date of death appraisal, back dated to the date of my mother\u2019s passing. I called around and could tell Brian had done a lot of them and helped me understand better what I needed. He charged $50 less than his competition, the appraisal arrived on time, and I am very happy with the service I received."
  },
  {
    name: "Ryan F.",
    source: "Yelp",
    location: "San Diego, CA",
    year: "2013",
    rating: 5,
    text: "Brian Ward IS one of the best at appraisals in the San Diego area. He is not only great at what he does, but he is honest, fair, and affordable! For his prices you are getting much more than just an appraisal \u2014 you are getting a one on one consultation on what goes into each appraisal."
  },
  {
    name: "Frank S.",
    source: "Yelp",
    location: "San Diego, CA",
    year: "2012",
    rating: 5,
    text: "Brian personally came out and did a very thorough and fair appraisal on my University City residence. He was very professional and had the appraisal done for the flat fee as advertised and completed the report in three business days!"
  },
  {
    name: "Sylvia D.",
    source: "Yelp",
    location: "San Diego, CA",
    year: "2011",
    rating: 5,
    text: "As executor of my mother\u2019s estate, I had to have her home here in San Diego appraised. After calling a couple of appraisers I came across Brian here on Yelp. He was the most willing to spend time with me to help me wade through my options and also suggested a lower priced option which saved the estate money."
  },
  {
    name: "Susan M.",
    source: "Yelp",
    location: "San Diego, CA",
    year: "2010",
    rating: 5,
    text: "Brian Ward is professional, courteous, and I am very happy with the appraisal I received. The appraisal is thorough and makes sense so I am confident that it will suit my need. I can\u2019t say enough about how my expectations have been exceeded!"
  },
  {
    name: "Karen M.",
    source: "Yelp",
    location: "San Diego, CA",
    year: "2010",
    rating: 5,
    text: "My father passed and I needed an appraiser for the San Diego area. Brian turned out to be old-fashioned service oriented and delivered good appraisals on time. Brian is a testament to appraisers everywhere and I encourage everyone to consider him if they need an appraisal."
  }
];

// Fisher-Yates shuffle
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Render stars
function stars(n) {
  return '<span class="review-stars">' + '\u2605'.repeat(n) + '</span>';
}

// Render a single review card
function renderReview(r) {
  const loc = r.location ? `<span class="review-location">${r.location}</span>` : '';
  return `
    <div class="review-card">
      <div class="review-card-header">
        ${stars(r.rating)}
        <span class="review-card-source">${r.source}</span>
      </div>
      <p class="review-card-text">\u201c${r.text}\u201d</p>
      <div class="review-card-footer">
        <span class="review-card-name">${r.name}</span>
        ${loc}
        <span class="review-card-year">${r.year}</span>
      </div>
    </div>`;
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
  const container = document.getElementById('reviews-container');
  const btn = document.getElementById('show-more-btn');
  const countEl = document.getElementById('reviews-count');
  if (!container) return;

  const shuffled = shuffle(allReviews);
  const batchSize = 8;
  let shown = 0;

  function showBatch() {
    const end = Math.min(shown + batchSize, shuffled.length);
    for (let i = shown; i < end; i++) {
      container.insertAdjacentHTML('beforeend', renderReview(shuffled[i]));
    }
    shown = end;
    if (countEl) countEl.textContent = `Showing ${shown} of ${shuffled.length} reviews`;
    if (shown >= shuffled.length && btn) {
      btn.style.display = 'none';
    }
  }

  showBatch();

  if (btn) {
    btn.addEventListener('click', function() {
      showBatch();
    });
  }
});
