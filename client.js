/**
 * Worktable — browser half.
 *
 * Adds a first-level Worktable pane below the Workspaces region in the left
 * sidebar. The pane is registered at `sidebar.footer.action` (the only list
 * seat below the Workspaces region), then lifted out of the sidebar foot with
 * `display: contents` on its two host containers. That makes the pane a layout
 * sibling of the Workspaces region, so the two take an equal share of the
 * sidebar body instead of sharing a footer row.
 *
 * The pane has a static header (localized title + add button) and an always
 * visible list; with no Worktables yet the list area shows the localized
 * "Empty" placeholder. Copy follows the Harness language setting.
 */
window.__ModuleLoader__.load({
  id: 'dsh-worktable',
  factory(require) {
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

    const React = require('react');
    const h = React.createElement;

    /** Locale namespace owned by this plugin. */
    const NS = 'dsh-worktable';

    /** Simplified Chinese dictionary (the key-set source of truth). */
    const zh = {
      title: '工作台',
      add: '添加工作台',
      empty: '空',
    };

    /** English dictionary, checked complete against the zh key set. */
    const en = {
      title: 'Worktable',
      add: 'Add worktable',
      empty: 'Empty',
    };

    /**
     * Styles copied from the shipped sidebar section header and row patterns,
     * expressed only through `--dsw-alias-*` theme tokens so light and dark
     * themes stay consistent. Classes are namespaced under `dsh-worktable`.
     *
     * The first two rules are the structural part: the sidebar shell declares
     * only a single `sidebar.workspaces` seat and no sibling section list, so a
     * pane below it can only start in the foot. Flattening the foot and its
     * action list (`display: contents`) promotes this pane to a direct child of
     * the sidebar column; the Workspaces region then takes two thirds of the
     * body and this pane the remaining third. Slot outlets already render as
     * `display: contents`, hence the two DOM levels in the selectors.
     */
    const CSS = [
      'div:has(> [data-slot="sidebar.footer.action"] > .dsh-worktable),div:has(> * > [data-slot="sidebar.footer.action"] > .dsh-worktable){display:contents}',
      'div:has(> [data-slot="sidebar.workspaces"]){flex:2 1 0;min-height:0}',
      '.dsh-worktable{position:relative;box-sizing:border-box;display:flex;flex:1 1 0;flex-direction:column;width:100%;min-width:0;min-height:0;border-top:.5px solid var(--dsw-alias-border-l1);font-size:14px;line-height:20px;color:var(--dsw-alias-label-primary)}',
      '.dsh-worktable__fade{position:absolute;z-index:1;left:0;right:0;bottom:100%;height:24px;pointer-events:none;opacity:0;background:linear-gradient(to bottom,transparent,var(--dsw-specific-sidebar-fill));transition:opacity .12s var(--ds-ease-in-out)}',
      '.dsh-worktable__fade[data-visible="true"]{opacity:1}',
      ':root:not([data-platform="darwin"]) .dsh-worktable__fade{display:none}',
      '.dsh-worktable__header{box-sizing:border-box;display:flex;flex:none;align-items:center;gap:4px;width:100%;min-width:0;height:36px;padding:0 4px;color:var(--dsw-alias-label-tertiary)}',
      '.dsh-worktable__label{flex:1;min-width:0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}',
      '.dsh-worktable__add{box-sizing:border-box;display:inline-flex;flex:none;align-items:center;justify-content:center;width:28px;height:28px;padding:0;border:0;border-radius:var(--dsw-radius-sm);background:transparent;color:var(--dsw-alias-label-secondary);cursor:pointer}',
      '.dsh-worktable__add:hover{background:var(--dsw-alias-interactive-bg-hover)}',
      '.dsh-worktable__add:focus-visible{outline:var(--dsw-focus-ring-width) solid var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary));outline-offset:-2px}',
      '.dsh-worktable__list{box-sizing:border-box;display:flex;flex:1 1 auto;flex-direction:column;min-height:0;overflow-y:auto;padding:0 0 8px}',
      '.dsh-worktable__empty{display:flex;flex:1;align-items:center;justify-content:center;padding:16px 12px;color:var(--dsw-alias-label-tertiary);font-size:13px;line-height:18px;text-align:center}',
      '.dsh-worktable__tooltip{display:inline-flex;align-items:center;gap:8px;position:fixed;z-index:100;width:max-content;max-width:50vw;padding:3px 7px;border-radius:var(--dsw-radius-sm);background:var(--dsw-alias-tooltip-bg);color:var(--dsw-static-neutral-bluish-00);font-size:13px;line-height:20px;white-space:pre-line;overflow-wrap:break-word;pointer-events:none;animation:dsh-worktable-tooltip-in .15s var(--ds-ease-in-out)}',
      '.dsh-worktable__tooltip[data-side="bottom"]{transform:translate(-50%)}',
      '.dsh-worktable__tooltip[data-side="top"]{transform:translate(-50%,-100%)}',
      '@keyframes dsh-worktable-tooltip-in{0%{opacity:0}}',
      '@media (prefers-reduced-motion:reduce){.dsh-worktable__tooltip{animation:none}.dsh-worktable__fade{transition:none}}',
    ].join('\n');

    /**
     * The shipped "Add workspace" glyph (`IconProjectAddOutlineRegular`): a
     * folder outline with a plus in its upper-right corner, 16px, 1px stroke.
     */
    function addIcon() {
      return h(
        'svg',
        {
          viewBox: '0 0 16 16',
          width: 16,
          height: 16,
          fill: 'none',
          xmlns: 'http://www.w3.org/2000/svg',
          'aria-hidden': 'true',
          strokeWidth: 1,
        },
        h('path', {
          d: 'M5.54492 2.06738C5.91034 2.06754 6.26318 2.20149 6.53711 2.44336L7.94043 3.68164V4.7998C7.71462 4.74105 7.50367 4.63139 7.32617 4.47461L5.87598 3.19238C5.78477 3.11185 5.66658 3.06754 5.54492 3.06738H2.94922C2.67322 3.06738 2.44946 3.29145 2.44922 3.56738V12.4326C2.44927 12.7087 2.67311 12.9326 2.94922 12.9326H12.9326C13.2086 12.9325 13.4326 12.7086 13.4326 12.4326V8.53613H14.4326V12.4326C14.4326 13.2609 13.7609 13.9325 12.9326 13.9326H2.94922C2.12083 13.9326 1.44927 13.261 1.44922 12.4326V3.56738C1.44946 2.73916 2.12094 2.06738 2.94922 2.06738H5.54492Z',
          fill: 'currentColor',
        }),
        h('path', {
          d: 'M9.75977 4.50208H14.5509',
          stroke: 'currentColor',
        }),
        h('path', {
          d: 'M12.1492 6.89758L12.1492 2.10642',
          stroke: 'currentColor',
        }),
      );
    }

    /**
     * Creation is the next milestone; the button exists now so the pane header
     * matches the Workspace header, and pressing it deliberately does nothing.
     */
    function requestAddWorktable() {}

    /** Hover delay used by the shipped Workspace header's add button. */
    const ADD_TOOLTIP_DELAY_MS = 500;

    /**
     * Hover/focus tooltip matching the shipped `Tooltip` bubble: same theme
     * tokens and type, a 500ms hover delay, bottom placement with an 8px gap,
     * a 12px viewport inset, and a flip to the top when nothing fits below.
     * The add action has no shortcut, so no keycap row is rendered.
     *
     * @param props - the localized tooltip label and the trigger element.
     * @returns the trigger plus the bubble while it is open.
     */
    function AddTooltip({ label, children }) {
      const [open, setOpen] = React.useState(false);
      const [place, setPlace] = React.useState(null);
      const anchorRef = React.useRef(null);
      const bubbleRef = React.useRef(null);
      const timerRef = React.useRef(null);
      const activeRef = React.useRef({ hover: false, focus: false });

      const clearTimer = React.useCallback(() => {
        if (timerRef.current !== null) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
      }, []);

      const placeBubble = React.useCallback(() => {
        const anchor = anchorRef.current;
        if (anchor === null) return;
        const rect = anchor.getBoundingClientRect();
        const gap = 8;
        const edge = 12;
        const bubble = bubbleRef.current;
        const width = bubble === null ? 0 : bubble.offsetWidth;
        const height = bubble === null ? 0 : bubble.offsetHeight;
        const center = rect.left + rect.width / 2;
        const left = Math.max(
          edge + width / 2,
          Math.min(center, window.innerWidth - edge - width / 2),
        );
        const fitsBelow = rect.bottom + gap + height <= window.innerHeight - edge;
        const fitsAbove = rect.top - gap - height >= edge;
        const side = !fitsBelow && fitsAbove ? 'top' : 'bottom';
        setPlace({
          left,
          top: side === 'bottom' ? rect.bottom + gap : rect.top - gap,
          side,
        });
      }, []);

      const hide = React.useCallback(() => {
        clearTimer();
        setOpen(false);
        setPlace(null);
      }, [clearTimer]);

      const reveal = React.useCallback(() => {
        clearTimer();
        if (open) {
          // Already visible: a locale change or focus re-entry only re-places it.
          placeBubble();
          return;
        }
        setPlace(null);
        setOpen(true);
      }, [clearTimer, open, placeBubble]);

      React.useEffect(() => {
        if (!open) return undefined;
        placeBubble();
        window.addEventListener('resize', placeBubble);
        return () => window.removeEventListener('resize', placeBubble);
      }, [open, label, placeBubble]);

      React.useEffect(() => clearTimer, [clearTimer]);

      const trigger = React.cloneElement(children, {
        ref: anchorRef,
        onMouseEnter: () => {
          activeRef.current.hover = true;
          clearTimer();
          timerRef.current = setTimeout(() => {
            timerRef.current = null;
            reveal();
          }, ADD_TOOLTIP_DELAY_MS);
        },
        onMouseLeave: () => {
          activeRef.current.hover = false;
          clearTimer();
          if (!activeRef.current.focus) hide();
        },
        onFocus: () => {
          activeRef.current.focus = true;
          reveal();
        },
        onBlur: () => {
          activeRef.current.focus = false;
          if (!activeRef.current.hover) hide();
        },
        onClick: (event) => {
          if (typeof children.props.onClick === 'function') {
            children.props.onClick(event);
          }
          activeRef.current.focus = false;
          hide();
        },
      });

      return h(
        React.Fragment,
        null,
        trigger,
        open &&
          h(
            'span',
            {
              ref: bubbleRef,
              className: 'dsh-worktable__tooltip',
              'data-side': place === null ? 'bottom' : place.side,
              role: 'tooltip',
              style:
                place === null
                  ? { visibility: 'hidden', left: 0, top: 0 }
                  : { left: place.left, top: place.top },
            },
            label,
          ),
      );
    }

    /**
     * Tracks whether the Workspaces scroller has content below its viewport.
     *
     * The shipped browser renders a bottom fade but hides it on macOS, and the
     * workspace list now lives in a shorter pane, so this pane draws its own
     * fade. The scroller is located by its computed overflow rather than by a
     * hashed class name, and the watchers are rebound if the browser replaces
     * its list. Only a scroll position at the very end hides the fade.
     *
     * @param wide - whether the sidebar renders its wide content.
     * @returns true while the workspace content continues below the viewport.
     */
    function useWorkspaceOverflow(wide) {
      const [overflowing, setOverflowing] = React.useState(false);

      React.useEffect(() => {
        if (!wide) {
          setOverflowing(false);
          return undefined;
        }

        const region = document.querySelector('[data-slot="sidebar.workspaces"]');
        if (region === null) return undefined;

        let scroller = null;
        let resizeObserver = null;
        let frame = 0;
        let disposed = false;

        function findScroller() {
          let best = null;
          for (const element of region.querySelectorAll('*')) {
            const overflowY = getComputedStyle(element).overflowY;
            if (overflowY !== 'auto' && overflowY !== 'scroll') continue;
            if (element.clientHeight === 0) continue;
            if (best === null || element.clientHeight > best.clientHeight) {
              best = element;
            }
          }
          return best;
        }

        function schedule() {
          if (frame === 0) frame = requestAnimationFrame(measure);
        }

        function measure() {
          frame = 0;
          if (disposed) return;
          if (scroller === null || !region.contains(scroller)) bind(findScroller());
          if (scroller === null) {
            setOverflowing(false);
            return;
          }
          const hasMore = scroller.scrollHeight > scroller.clientHeight + 1;
          const atBottom =
            scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 1;
          setOverflowing(hasMore && !atBottom);
        }

        function bind(next) {
          if (scroller !== null) scroller.removeEventListener('scroll', schedule);
          if (resizeObserver !== null) resizeObserver.disconnect();
          scroller = next;
          if (scroller === null) return;
          scroller.addEventListener('scroll', schedule, { passive: true });
          resizeObserver = new ResizeObserver(schedule);
          resizeObserver.observe(scroller);
        }

        bind(findScroller());

        // The browser can swap the scroller when its view changes, and list
        // expansion or filtering changes the content height without a resize.
        const observer = new MutationObserver(schedule);
        observer.observe(region, {
          childList: true,
          subtree: true,
          characterData: true,
          attributes: true,
          attributeFilter: ['class', 'style', 'aria-expanded', 'data-state'],
        });
        window.addEventListener('resize', schedule);
        schedule();

        return () => {
          disposed = true;
          if (frame !== 0) cancelAnimationFrame(frame);
          observer.disconnect();
          window.removeEventListener('resize', schedule);
          if (resizeObserver !== null) resizeObserver.disconnect();
          if (scroller !== null) scroller.removeEventListener('scroll', schedule);
        };
      }, [wide]);

      return overflowing;
    }

    /**
     * The Worktable pane: a static header plus the list area.
     *
     * @param props - the slot's `wide` owner prop (`false` in the 56px rail)
     *   and the locale-injected `t` seat.
     * @returns the pane, or null while the sidebar is collapsed to its rail.
     */
    function WorktableSection({ wide, t }) {
      const workspaceOverflowing = useWorkspaceOverflow(wide);

      // The rail has no room for a below-the-body pane.
      if (!wide) return null;

      return h(
        'div',
        { className: 'dsh-worktable', 'data-worktable': 'section' },
        h('style', { key: 'styles' }, CSS),
        h('span', {
          key: 'fade',
          className: 'dsh-worktable__fade',
          'data-visible': workspaceOverflowing ? 'true' : 'false',
          'aria-hidden': 'true',
        }),
        h(
          'div',
          { className: 'dsh-worktable__header' },
          h('span', { className: 'dsh-worktable__label' }, t('title')),
          h(
            AddTooltip,
            { label: t('add') },
            h(
              'button',
              {
                type: 'button',
                className: 'dsh-worktable__add',
                'aria-label': t('add'),
                onClick: requestAddWorktable,
              },
              addIcon(),
            ),
          ),
        ),
        h(
          'div',
          {
            className: 'dsh-worktable__list',
            role: 'group',
            'aria-label': t('title'),
          },
          h('div', { className: 'dsh-worktable__empty' }, t('empty')),
        ),
      );
    }

    WorktableSection.displayName = 'WorktableSection';

    /** Services the Client half needs; without them the entry stays inactive. */
    const inject = ['slots', 'locale'];

    /**
     * Registers the dictionaries and the sidebar-foot entry.
     *
     * @param ctx - the Client root context.
     */
    function apply(ctx) {
      ctx.effect(
        () => ctx.locale.register(NS, { zh, en }),
        'dsh-worktable: dictionaries',
      );

      ctx.slots.inject('sidebar.footer.action', () =>
        ctx.slots.register(
          {
            name: 'sidebar.footer.action',
            id: 'dsh-worktable',
            order: 30,
            locale: NS,
          },
          WorktableSection,
        ),
      );
    }

    exports.apply = apply;
    exports.inject = inject;
    return module.exports;
  },
});
