import React, { useRef, useEffect } from "react";
import { useEditor } from "craftjs";
import { useLayerManager } from "../manager/useLayerManager";
import { useLayer } from "./useLayer";
import { LayerContextProvider } from "./context";

export const LayerNode: React.FC = () => {
  const { id, depth, children, expanded  } = useLayer((layer) => ({
    expanded: layer.expanded
  }));

  const { data, query, shouldBeExpanded } = useEditor((state, query) => ({
    data: state.nodes[id] && state.nodes[id].data,
    shouldBeExpanded: state.events.active && query.getAllParents(state.events.active).includes(id)
  }));

  const { actions, renderLayer, renderLayerHeader } = useLayerManager((state) => ({
    renderLayer: state.options.renderLayer,
    renderLayerHeader: state.options.renderLayerHeader
  }));

  const expandedRef = useRef<boolean>(expanded);
  expandedRef.current = expanded;

  useEffect(() => {
    if (!expandedRef.current && shouldBeExpanded ) {
      actions.toggleLayer(id);
    }
  }, [shouldBeExpanded])
  

  const initRef = useRef<boolean>(false);
  if ( !initRef.current ) {
    actions.registerLayer(id);
    initRef.current = true;
  }
  return (
    data ? ( 
      <div className={`craft-layer-node ${id}`}>
        {
          React.createElement(renderLayer, {}, 
            (children && expanded) ?
              children.map(id =>
                <LayerContextProvider key={id} id={id} depth={depth + 1} />
              ) : null   
          )
        }
      </div>
    ): null
  );
}