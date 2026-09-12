import React, { useState, useEffect } from 'react';
import { ExternalLink, MapPin, ChevronDown } from 'lucide-react';
import type { Location } from '../data/locations';
import { useAdmin } from '../context/AdminContext';
import './About.css';

export const About: React.FC = () => {
  const { siteContent, locations } = useAdmin();
  const [expandedAreas, setExpandedAreas] = useState<Record<string, boolean>>({});

  // Group locations by area
  const groupedLocations = locations.reduce((acc, loc) => {
    const areaKey = loc.area || 'Other Locations';
    if (!acc[areaKey]) {
      acc[areaKey] = [];
    }
    acc[areaKey].push(loc);
    return acc;
  }, {} as Record<string, Location[]>);

  // Order of areas for consistent display
  const areaKeys = Object.keys(groupedLocations);

  // Toggle open/closed state for a specific area rectangle
  const toggleArea = (areaName: string) => {
    setExpandedAreas((prev) => ({
      ...prev,
      [areaName]: !prev[areaName],
    }));
  };

  // If only 1 area exists, auto-expand it for convenience
  useEffect(() => {
    if (areaKeys.length === 1) {
      setExpandedAreas({ [areaKeys[0]]: true });
    }
  }, [areaKeys.length]);

  return (
    <div className="about-page">
      {/* 1. EDITORIAL HERO */}
      <section className="about-hero bg-aqua">
        <div className="container about-hero-container">
          <div className="about-hero-content">
            <span className="section-eyebrow">{siteContent.aboutHeroEyebrow}</span>
            <h1 className="about-hero-headline">
              {(siteContent?.aboutHeroHeadline || '').split('\n').map((line, i, arr) => (
                <React.Fragment key={i}>
                  {i === arr.length - 1 ? <span className="text-aqua-dark">{line}</span> : line}
                  {i < arr.length - 1 && <br />}
                </React.Fragment>
              ))}
            </h1>
            <p className="about-hero-subtext">
              {siteContent.aboutHeroSubtext}
            </p>
          </div>
          <div className="about-hero-visual">
            <div className="about-hero-frame">
              <img src={siteContent.aboutHeroImg} alt="BITE UP Brand Poster Amman" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. WHY BITE UP — EDITORIAL PHILOSOPHY */}
      <section className="about-story bg-white">
        <div className="container">
          <div className="story-split-grid">
            <div className="story-left-col">
              <span className="section-eyebrow">{siteContent.aboutMissionEyebrow}</span>
              <h2 className="story-bold-title">{siteContent.aboutMissionTitle}</h2>
              <p className="story-lead-p" style={{ whiteSpace: 'pre-wrap' }}>
                {siteContent.aboutMissionLeadP}
              </p>
              <p className="story-second-p" style={{ whiteSpace: 'pre-wrap' }}>
                {siteContent.aboutMissionSecondP}
              </p>
            </div>

            <div className="story-right-col">
              <div className="story-image-card">
                <img src={siteContent.aboutMissionImg} alt="BITE UP Chocolate Protein Pudding" />
                <div className="story-image-caption">
                  <span>{siteContent.aboutMissionImageCaption}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FOUR CORE VALUES BANNER */}
      <section className="philosophy-section bg-dark">
        <div className="container">
          <div className="philosophy-grid">
            <div className="phil-item">
              <span className="phil-number">01</span>
              <h3>{siteContent.aboutPhilPillar1Title}</h3>
              <p>{siteContent.aboutPhilPillar1Desc}</p>
            </div>
            <div className="phil-item">
              <span className="phil-number">02</span>
              <h3>{siteContent.aboutPhilPillar2Title}</h3>
              <p>{siteContent.aboutPhilPillar2Desc}</p>
            </div>
            <div className="phil-item">
              <span className="phil-number">03</span>
              <h3>{siteContent.aboutPhilPillar3Title}</h3>
              <p>{siteContent.aboutPhilPillar3Desc}</p>
            </div>
            <div className="phil-item">
              <span className="phil-number">04</span>
              <h3>{siteContent.aboutPhilPillar4Title}</h3>
              <p>{siteContent.aboutPhilPillar4Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHERE TO FIND BITE UP — ACCORDION BY AREA */}
      <section className="locations-section bg-off-white" id="locations">
        <div className="container">
          <div className="locations-header">
            <span className="section-eyebrow">{siteContent.aboutRetailEyebrow}</span>
            <h2 className="section-headline">{siteContent.aboutRetailHeadline}</h2>
            <p className="locations-subtitle">
              {siteContent.aboutRetailSubtitle}
            </p>
          </div>

          {/* Area Accordion List */}
          <div className="area-accordion-list">
            {areaKeys.map((areaName) => {
              const spots = groupedLocations[areaName];
              const isOpen = !!expandedAreas[areaName];
              return (
                <div 
                  className={`area-accordion-item ${isOpen ? 'is-open' : 'is-collapsed'}`} 
                  key={areaName}
                >
                  <button
                    type="button"
                    className="area-accordion-trigger"
                    onClick={() => toggleArea(areaName)}
                    aria-expanded={isOpen}
                    aria-controls={`area-content-${areaName.replace(/\s+/g, '-').toLowerCase()}`}
                  >
                    <div className="area-title-wrap">
                      <div className="area-pin-circle">
                        <MapPin size={18} className="area-pin-icon" />
                      </div>
                      <h3 className="area-name">{(areaName || '').toUpperCase()}</h3>
                    </div>

                    <div className="area-header-actions">
                      <span className="area-count-badge">
                        {spots.length} {spots.length === 1 ? 'SPOT' : 'SPOTS'}
                      </span>
                      <div className={`area-chevron-circle ${isOpen ? 'rotated' : ''}`} aria-hidden="true">
                        <ChevronDown size={20} strokeWidth={2.5} />
                      </div>
                    </div>
                  </button>

                  {isOpen && (
                    <div 
                      className="area-accordion-body" 
                      id={`area-content-${areaName.replace(/\s+/g, '-').toLowerCase()}`}
                    >
                      <div className="area-spots-list">
                        {spots.map((spot) => (
                          <div className="spot-row-item" key={spot.id}>
                            <div className="spot-info">
                              <span className="spot-title">{spot.name}</span>
                              {spot.note && (
                                <span className="spot-note-text">
                                  {spot.note}
                                </span>
                              )}
                            </div>
                            <a
                              href={spot.mapUrl ? (spot.mapUrl.startsWith('http') ? spot.mapUrl : `https://${spot.mapUrl}`) : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(spot.name + ' ' + spot.area + ' Amman')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="spot-map-action"
                              title={`View ${spot.name} on Google Maps`}
                            >
                              <span>VIEW DIRECTIONS</span>
                              <ExternalLink size={13} />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
