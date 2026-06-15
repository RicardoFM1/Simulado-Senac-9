<?php
require_once __DIR__ . "/../../Services/Convidado/convidadoService.php";

class DashboardController {
    public function listarDashboard () {
        $convidados = new ConvidadoService()->listarConvidados();

        $convidadosConfirmados = null;
        $convidadosPendentes = null;
        $convidadosCancelados = null;

        foreach($convidados['dados'] as $convidado){
            if($convidado['confirmacao'] === 'confirmado'){
                $convidadosConfirmados++;
            }
             if($convidado['confirmacao'] === 'pendente'){
                $convidadosPendentes++;
            } if($convidado['confirmacao'] === 'cancelado'){
                $convidadosCancelados++;
            }
        }

        return [
            'sucesso' => true,
            'dados' => [
                'confirmados' => $convidadosConfirmados ?? 0,
                'pendentes' => $convidadosPendentes ?? 0,
                'cancelados' => $convidadosCancelados ?? 0,
                'total' => count($convidados['dados'])
            ]
        ];
    }


}