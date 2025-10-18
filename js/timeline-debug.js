// Timeline Debug Script
document.addEventListener('DOMContentLoaded', () => {
    console.log('Timeline Debug: Starting...');
    
    const timelineContainer = document.querySelector('.timeline-container');
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineCards = document.querySelectorAll('.timeline-card');
    const timelineDots = document.querySelectorAll('.timeline-dot');
    const timelineLine = document.querySelector('.timeline-line');
    
    console.log('Timeline Debug Results:');
    console.log('- Timeline container found:', !!timelineContainer);
    console.log('- Timeline items found:', timelineItems.length);
    console.log('- Timeline cards found:', timelineCards.length);
    console.log('- Timeline dots found:', timelineDots.length);
    console.log('- Timeline line found:', !!timelineLine);
    
    if (timelineContainer) {
        console.log('- Container styles:', {
            overflow: getComputedStyle(timelineContainer).overflow,
            position: getComputedStyle(timelineContainer).position,
            display: getComputedStyle(timelineContainer).display
        });
    }
    
    if (timelineItems.length > 0) {
        console.log('- First timeline item styles:', {
            position: getComputedStyle(timelineItems[0]).position,
            width: getComputedStyle(timelineItems[0]).width,
            display: getComputedStyle(timelineItems[0]).display
        });
    }
    
    if (timelineCards.length > 0) {
        console.log('- First timeline card styles:', {
            background: getComputedStyle(timelineCards[0]).background,
            height: getComputedStyle(timelineCards[0]).height,
            display: getComputedStyle(timelineCards[0]).display
        });
    }
    
    // Test animation
    const timelineItemsContainer = document.querySelector('.timeline-items');
    if (timelineItemsContainer) {
        console.log('- Timeline items container found:', true);
        console.log('- Animation:', getComputedStyle(timelineItemsContainer).animation);
        console.log('- Transform:', getComputedStyle(timelineItemsContainer).transform);
    }
});
