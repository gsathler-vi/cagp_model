// CurriculumSvgMap.tsx - Canvas Vetorial do Grafo Curricular das 27 Obrigatórias
import React from 'react';
import { DISCIPLINAS_GRAFO, DEPT_COLORS, getColX, type CourseNodeData } from './curriculumGraphData';

interface Props {
  selectedNodeId: string | null;
  activeTrack: string;
  completedCourses: string[];
  onSelectNode: (id: string | null) => void;
}

export const CurriculumSvgMap: React.FC<Props> = ({
  selectedNodeId,
  activeTrack,
  completedCourses,
  onSelectNode,
}) => {
  const [hoveredNodeId, setHoveredNodeId] = React.useState<string | null>(null);
  const activeFocusId = selectedNodeId || hoveredNodeId;
  const activeData: CourseNodeData | null = activeFocusId ? DISCIPLINAS_GRAFO[activeFocusId] : null;

  // Renderizar Conexões Bezier
  const renderLinks = () => {
    const links: React.ReactElement[] = [];

    Object.keys(DISCIPLINAS_GRAFO).forEach((fromId) => {
      const fromDisc = DISCIPLINAS_GRAFO[fromId];
      const fromX = getColX(fromDisc.col) + 104;
      const fromY = fromDisc.y + 37;

      // 1. Links Formais (Trava no SIGA)
      fromDisc.formalUnlocks.forEach((toId) => {
        const toDisc = DISCIPLINAS_GRAFO[toId];
        if (!toDisc) return;
        const toX = getColX(toDisc.col);
        const toY = toDisc.y + 37;
        const dx = Math.max(25, (toX - fromX) * 0.45);
        const d = `M ${fromX} ${fromY} C ${fromX + dx} ${fromY}, ${toX - dx} ${toY}, ${toX} ${toY}`;

        let linkClass = 'grafo-link link-formal';
        let marker = 'url(#arrow-formal)';

        if (activeFocusId) {
          const isReq = (activeData?.formalReqs.includes(fromId) || activeData?.suggestedReqs.includes(fromId)) && toId === activeFocusId;
          const isNext = fromId === activeFocusId && (activeData?.formalUnlocks.includes(toId) || activeData?.suggestedUnlocks.includes(toId));
          if (isReq) {
            linkClass += ' is-active-req';
            marker = 'url(#arrow-formal)';
          } else if (isNext) {
            linkClass += ' is-active-next';
            marker = 'url(#arrow-formal)';
          } else {
            linkClass += ' is-dimmed';
          }
        }

        links.push(
          <path
            key={`link-${fromId}-${toId}`}
            id={`link-${fromId}-${toId}`}
            d={d}
            className={linkClass}
            markerEnd={marker}
          />
        );
      });

      // 2. Links Sugeridos (Encadeamento Pedagógico)
      fromDisc.suggestedUnlocks.forEach((toId) => {
        const toDisc = DISCIPLINAS_GRAFO[toId];
        if (!toDisc) return;
        const toX = getColX(toDisc.col);
        const toY = toDisc.y + 37;
        const dx = Math.max(25, (toX - fromX) * 0.45);
        const d = `M ${fromX} ${fromY} C ${fromX + dx} ${fromY}, ${toX - dx} ${toY}, ${toX} ${toY}`;

        let linkClass = 'grafo-link';
        let marker = 'url(#arrow-default)';

        if (activeFocusId) {
          const isReq = (activeData?.formalReqs.includes(fromId) || activeData?.suggestedReqs.includes(fromId)) && toId === activeFocusId;
          const isNext = fromId === activeFocusId && (activeData?.formalUnlocks.includes(toId) || activeData?.suggestedUnlocks.includes(toId));
          if (isReq) {
            linkClass += ' is-active-req';
            marker = 'url(#arrow-req)';
          } else if (isNext) {
            linkClass += ' is-active-next';
            marker = 'url(#arrow-next)';
          } else {
            linkClass += ' is-dimmed';
          }
        }

        links.push(
          <path
            key={`link-${fromId}-${toId}`}
            id={`link-${fromId}-${toId}`}
            d={d}
            className={linkClass}
            markerEnd={marker}
          />
        );
      });
    });

    return links;
  };

  return (
    <svg
      className="cagp-grafo-svg"
      viewBox="0 0 1210 600"
      xmlns="http://www.w3.org/2000/svg"
      role="application"
      aria-label="Mapa Interativo de Pré-Requisitos e Encadeamento Curricular"
    >
      <defs>
        <marker id="arrow-default" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 9 5 L 0 9 z" fill="#9CA3AF" />
        </marker>
        <marker id="arrow-formal" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 9 5 L 0 9 z" fill="#DC2626" />
        </marker>
        <marker id="arrow-req" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 9 5 L 0 9 z" fill="#E8A317" />
        </marker>
        <marker id="arrow-next" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 9 5 L 0 9 z" fill="#15803D" />
        </marker>
      </defs>

      {/* 10 Colunas dos Semestres */}
      <g id="grafo-cols">
        {Array.from({ length: 10 }).map((_, i) => {
          const colNum = i + 1;
          const cx = getColX(colNum);
          return (
            <g key={`col-${colNum}`}>
              <rect
                className="grafo-col-bg"
                x={cx - 4}
                y={15}
                width={112}
                height={570}
                rx={4}
              />
              <text
                className="grafo-col-header"
                x={cx + 52}
                y={34}
                textAnchor="middle"
              >
                {colNum}º PERÍODO
              </text>
            </g>
          );
        })}
      </g>

      {/* Conexões */}
      <g id="grafo-links">{renderLinks()}</g>

      {/* Nós das 27 Disciplinas */}
      <g id="grafo-nodes">
        {Object.keys(DISCIPLINAS_GRAFO).map((id, idx) => {
          const d = DISCIPLINAS_GRAFO[id];
          const x = getColX(d.col);
          const y = d.y;
          const isSelected = selectedNodeId === id;
          const isHovered = hoveredNodeId === id;
          const isCompleted = completedCourses.includes(id) || completedCourses.includes(d.code) || completedCourses.includes(d.code.replace(/\s+/g, ''));

          const isPrereq = Boolean(
            activeData &&
            (activeData.formalReqs.includes(id) || activeData.suggestedReqs.includes(id))
          );
          const isUnlocked = Boolean(
            activeData &&
            (activeData.formalUnlocks.includes(id) || activeData.suggestedUnlocks.includes(id))
          );

          let isDimmed = false;
          if (activeTrack !== 'all' && d.track !== activeTrack) {
            isDimmed = true;
          } else if (activeFocusId && !isSelected && !isHovered && !isPrereq && !isUnlocked) {
            isDimmed = true;
          }

          let nodeClasses = 'grafo-node';
          if (isSelected || isHovered) nodeClasses += ' is-selected';
          if (isPrereq) nodeClasses += ' is-prereq';
          if (isUnlocked) nodeClasses += ' is-unlocked';
          if (isDimmed) nodeClasses += ' is-dimmed';
          if (isCompleted) nodeClasses += ' is-completed';

          return (
            <g
              key={`node-${id}`}
              id={`node-${id}`}
              className={nodeClasses}
              tabIndex={idx === 0 ? 0 : -1}
              role="button"
              aria-label={`${d.code}: ${d.name} (${d.period}º Período).`}
              onClick={() => onSelectNode(isSelected ? null : id)}
              onMouseEnter={() => setHoveredNodeId(id)}
              onMouseLeave={() => setHoveredNodeId(null)}
            >
              {/* Card Retangular */}
              <rect
                className="node-card"
                x={x}
                y={y}
                width={104}
                height={74}
              />

              {/* Badge Superior Direito */}
              {d.isFormalLock ? (
                <g>
                  <rect
                    className="node-lock-badge"
                    x={x + 58}
                    y={y + 6}
                    width={40}
                    height={13}
                  />
                  <text
                    className="node-lock-text"
                    x={x + 78}
                    y={y + 15.5}
                    textAnchor="middle"
                  >
                    TRAVA
                  </text>
                </g>
              ) : (
                <g>
                  <rect
                    className="node-badge"
                    x={x + 68}
                    y={y + 6}
                    width={30}
                    height={13}
                    style={{ fill: DEPT_COLORS[d.dept] || '#8B1E2D' }}
                  />
                  <text
                    className="node-badge-text"
                    x={x + 83}
                    y={y + 15.5}
                    textAnchor="middle"
                  >
                    {d.dept}
                  </text>
                </g>
              )}

              {/* Código da Matéria */}
              <text className="node-code" x={x + 7} y={y + 17}>
                {d.code}
              </text>

              {/* Linhas do Nome */}
              {d.lines.map((line, lIdx) => (
                <text
                  key={`line-${lIdx}`}
                  className="node-name"
                  x={x + 7}
                  y={y + 35 + lIdx * 11}
                >
                  {line}
                </text>
              ))}

              {/* Indicador de Cursada no Canto */}
              {isCompleted && (
                <text
                  x={x + 92}
                  y={y + 66}
                  fill="#15803D"
                  fontSize="13"
                  fontWeight="bold"
                >
                  ✓
                </text>
              )}
            </g>
          );
        })}
      </g>
    </svg>
  );
};
