import { Tooltip } from "./util/tooltip.js";

// Selecting all elements with the class 'trigger' which will activate tooltips on mouse events.
const triggers = document.querySelectorAll('.trigger');

// Helper function to determine if the device supports touch events

// Determine if we should use touch events instead of mouse events

// Define the event names based on the device capabilities
const startEvent = 'mouseenter';
const endEvent = 'mouseleave';
const moveEvent = 'mousemove';

// Creating an array of Tooltip instances by mapping over each trigger element.
const tooltips = Array.from(triggers).map(trigger => {
    const tooltipEl = document.getElementById(trigger.dataset.tooltip);
    return tooltipEl ? new Tooltip(tooltipEl) : null;
});

// Add event listeners for each trigger
triggers.forEach((trigger, index) => {
    const tooltip = tooltips[index];
    if (!tooltip) return;

    let showTimeout, hideTimeout;

    // Start event to show or update the tooltip
    trigger.addEventListener(startEvent, event => {
        clearTimeout(hideTimeout);
        showTimeout = setTimeout(() => {
            const touchEvent = event;

            if (!tooltip.isOpen) {
                tooltip.updatePosition(touchEvent);
                tooltip.toggle(trigger.dataset.effect, touchEvent);
            }
        }, 40); // Delay before showing the tooltip
    });

    // Move event to update the tooltip position
    trigger.addEventListener(moveEvent, event => {
        const touchEvent = event;

        if (tooltip.isOpen) {
            tooltip.updatePosition(touchEvent);
        }
    });

    // End event to hide the tooltip
    trigger.addEventListener(endEvent, event => {
        clearTimeout(showTimeout);
        hideTimeout = setTimeout(() => {
            if (tooltip.isOpen) {
                tooltip.toggle(trigger.dataset.effect, event);
            }
        }, 40); // Delay before hiding the tooltip
    });
});