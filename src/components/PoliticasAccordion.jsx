import { useState } from 'react'
import { Link } from 'react-router-dom'
import './PoliticasAccordion.css'

const POLICIES = [
  {
    title: 'Política de Calidad',
    text: 'En Croma Medical IPS nos comprometemos con la mejora continua de nuestros procesos asistenciales y administrativos, cumpliendo los estándares de habilitación vigentes para garantizar una atención segura, oportuna y satisfactoria para nuestros pacientes.',
  },
  {
    title: 'Política de Seguridad del Paciente',
    text: 'Trabajamos para prevenir, identificar y gestionar los riesgos asociados a la atención en salud, promoviendo una cultura de seguridad en cada etapa del proceso asistencial.',
    link: { to: '/seguridad-del-paciente', label: 'Leer política completa →' },
  },
  {
    title: 'Política de Humanización',
    text: 'Croma Medical IPS asume su política de humanización con un enfoque hacia el trato digno e integral a los usuarios, sus familias, la comunidad, colaboradores y proveedores, fundamentada en dimensiones físicas, espirituales, intelectuales, emocionales y sociales, con el propósito de brindar una atención cálida y respetuosa por parte de todo nuestro equipo humano.',
  },
  {
    title: 'Política del Sistema de Gestión de la Seguridad y Salud en el Trabajo',
    text: 'Promovemos ambientes de trabajo seguros y saludables, identificando y controlando los riesgos laborales para proteger la integridad física y mental de todos nuestros colaboradores, en cumplimiento de la normatividad vigente.',
  },
  {
    title: 'Política Ambiental',
    text: 'Gestionamos de forma responsable los residuos generados por nuestra operación y promovemos el uso eficiente de los recursos, minimizando el impacto ambiental de nuestras actividades.',
  },
  {
    title: 'Política de Atención con Enfoque Diferencial',
    text: 'Brindamos una atención incluyente que reconoce y respeta las diferencias de género, edad, etnia, condición de discapacidad y ciclo vital de cada paciente, adaptando nuestros servicios a sus necesidades particulares.',
  },
  {
    title: 'Plan de Transparencia y Ética Empresarial (PTEE)',
    text: 'Actuamos bajo principios de integridad y transparencia, previniendo prácticas de corrupción, soborno, lavado de activos y financiación del terrorismo en nuestra relación con colaboradores, pacientes y proveedores.',
  },
]

export default function PoliticasAccordion() {
  const [active, setActive] = useState(1)

  return (
    <ul className="policies-accordion">
      {POLICIES.map((p, i) => {
        const isActive = active === i
        return (
          <li key={p.title} className={`policy-item ${isActive ? 'is-active' : ''}`}>
            <button
              type="button"
              className="policy-trigger"
              onClick={() => setActive(isActive ? -1 : i)}
              aria-expanded={isActive}
            >
              <span className="policy-icon">{isActive ? '−' : '+'}</span>
              <span>{p.title}</span>
            </button>
            {isActive && (
              <div className="policy-body">
                <p>{p.text}</p>
                {p.link && (
                  <Link to={p.link.to} className="policy-link">
                    {p.link.label}
                  </Link>
                )}
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}
