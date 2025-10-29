import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Tab,
  Fade,
} from '@mui/material';
import {
  Download as DownloadIcon,
} from '@mui/icons-material';
import DownloadCard from './DownloadCard';

/**
 * Download Section Component - Saved for future use
 * This component was originally part of MovieDetail.jsx
 * Contains the download functionality and UI for movie downloads
 */

const DownloadSection = ({ movieId }) => {
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDownloads = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/downloads/movie/${movieId}`);
        
        if (response.ok) {
          const downloadsData = await response.json();
          if (downloadsData.success) {
            // Flatten the grouped downloads into a single array
            const allDownloads = [];
            Object.values(downloadsData.data.downloads).forEach(qualityGroup => {
              allDownloads.push(...qualityGroup);
            });
            setDownloads(allDownloads);
          }
        }
      } catch (error) {
        console.error('Error fetching downloads:', error);
      } finally {
        setLoading(false);
      }
    };

    if (movieId) {
      fetchDownloads();
    }
  }, [movieId]);

  return (
    <Fade in>
      <Box>
        <Typography variant="h6" sx={{ color: 'white', mb: 3, fontWeight: 600 }}>
          Download Options ({downloads.length} available)
        </Typography>
        {downloads.length > 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {downloads.map((download, index) => (
              <DownloadCard
                key={download._id || index}
                download={download}
                onDownload={(downloadId, link) => {
                  // Handle download tracking
                  console.log('Download started:', downloadId, link);
                  // You can add API call here to increment download count
                }}
              />
            ))}
          </Box>
        ) : (
          <Box
            sx={{
              textAlign: 'center',
              py: 6,
              color: 'rgba(255, 255, 255, 0.7)',
            }}
          >
            <DownloadIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>
              No Downloads Available
            </Typography>
            <Typography variant="body2">
              Download links for this movie are not available yet.
            </Typography>
          </Box>
        )}
      </Box>
    </Fade>
  );
};

export default DownloadSection;

/**
 * ORIGINAL TAB STRUCTURE FROM MOVIEDETAIL.JSX:
 * 
 * // In the tabs section:
 * <Tab label="Download" />
 * 
 * // In the tab content section:
 * {tabValue === 2 && (
 *   <DownloadSection movieId={id} />
 * )}
 * 
 * ORIGINAL IMPORTS NEEDED:
 * import { Download as DownloadIcon } from '@mui/icons-material';
 * import DownloadCard from '../components/UI/DownloadCard';
 * 
 * ORIGINAL STATE VARIABLES:
 * const [downloads, setDownloads] = useState([]);
 * 
 * ORIGINAL FETCH LOGIC (in useEffect):
 * const [movieRes, downloadsRes] = await Promise.all([
 *   fetch(`http://localhost:5000/api/movies/${id}`),
 *   fetch(`http://localhost:5000/api/downloads/movie/${id}`)
 * ]);
 * 
 * if (downloadsRes.ok) {
 *   const downloadsData = await downloadsRes.json();
 *   if (downloadsData.success) {
 *     const allDownloads = [];
 *     Object.values(downloadsData.data.downloads).forEach(qualityGroup => {
 *       allDownloads.push(...qualityGroup);
 *     });
 *     setDownloads(allDownloads);
 *   }
 * }
 */