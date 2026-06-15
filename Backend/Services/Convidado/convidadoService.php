<?php

use Firebase\JWT\JWT;

require_once __DIR__ . "/../../Connection/db.php";
require_once __DIR__ . "/../Mesa/mesaService.php";

class ConvidadoService
{
    protected $db;

    public function __construct()
    {
        $this->db = db();
    }

    public function buscarConvidadoPorEmail($email)
    {
        if (empty($email)) {
            throw new Exception('Dados inválidos', 400);
        }

        $buscar = $this->db->prepare('SELECT * FROM convidado WHERE email = :email');

        $buscar->execute([
            ':email' => $email
        ]);

        $convidado = $buscar->fetch();

        if (empty($convidado)) {
            return [
                'sucesso' => false,
                'mensagem' => 'Convidado não encontrado',
                'codigo' => 404
            ];
        }

        return [
            'sucesso' => true,
            'dados' => $convidado
        ];
    }

    public function buscarConvidadosPorMesaId($idMesa)
    {
        if (empty($idMesa)) {
            throw new Exception('Dados inválidos', 400);
        }

        $buscar = $this->db->prepare('SELECT * FROM convidado WHERE mesa_idmesa = :mesa_idmesa');

        $buscar->execute([
            ':mesa_idmesa' => $idMesa
        ]);

        $convidado = $buscar->fetchAll();

        if (empty($convidado)) {
            return [
                'sucesso' => false,
                'mensagem' => 'Convidado não encontrado',
                'codigo' => 404
            ];
        }

        return [
            'sucesso' => true,
            'dados' => $convidado
        ];
    }

    public function listarConvidados()
    {
        $query = $this->db->query('SELECT * FROM convidado');

        $query->execute();

        $convidados = $query->fetchAll();

        return [
            'sucesso' => true,
            'dados' => $convidados
        ];
    }

    public function  criarConvidado($convidadoDados)
    {
        try {

            $convidadoDados['cpf'] = preg_replace('/\D/', '', $convidadoDados['cpf']);
            $convidadoDados['telefone'] = preg_replace('/\D/', '', $convidadoDados['telefone']);


            $criar = $this->db->prepare('INSERT INTO convidado (nome, sobrenome, email, cpf, categoria, telefone, mesa_idmesa)
            VALUES (:nome, :sobrenome, :email, :cpf, :categoria, :telefone, :mesa_idmesa)');

            $criar->execute([
                ':nome' => $convidadoDados['nome'],
                ':sobrenome' => $convidadoDados['sobrenome'],
                ':email' => $convidadoDados['email'],
                ':cpf' => $convidadoDados['cpf'],
                ':categoria' => $convidadoDados['categoria'],
                ':telefone' => $convidadoDados['telefone'],
                ':mesa_idmesa' => $convidadoDados['mesa_idmesa']
            ]);

            return [
                'sucesso' => true,
                'mensagem' => 'Convidado criado com sucesso'
            ];
        } catch (PDOException $e) {
            if (str_contains($e->getMessage(), 'email')) {
                throw new Exception('Email já em uso', 409);
            }
            if (str_contains($e->getMessage(), 'cpf')) {
                throw new Exception('Cpf já em uso', 409);
            }

            if (str_contains($e->getMessage(), 'fk_convidado_mesa')) {
                throw new Exception('Mesa referenciada não encontrada', 404);
            }
            throw new Exception('Erro ao criar convidado', 500);
        }
    }



    public function atualizarConvidado($convidadoDados, $emailConvidado, $jwt)
    {
        try {
            $convidadoDados['cpf'] = preg_replace('/\D/', '', $convidadoDados['cpf']);
            $convidadoDados['telefone'] = preg_replace('/\D/', '', $convidadoDados['telefone']);

            $convidado = $this->buscarConvidadoPorEmail($emailConvidado);

            if ($convidado['sucesso'] === false) {
                throw new Exception($convidado['mensagem'], $convidado['codigo']);
            }

            if ($convidado['dados']['confirmacao'] === 'confirmado' && $convidadoDados['confirmacao'] !== 'confirmado' && $jwt->dados->cargo_usuario !== 'administrador') {
                throw new Exception('Sem permissão para mudar a confirmação do convidado (Apenas para a administração)', 403);
            }

            $mesaReferenciada = new MesaService()->buscarMesaPorId($convidadoDados['mesa_idmesa']);
            $convidadosComReferencia = $this->buscarConvidadosPorMesaId($convidadoDados['mesa_idmesa']);

            if ($convidadosComReferencia['sucesso'] === true) {
                if (count($convidadosComReferencia['dados']) >= $mesaReferenciada['dados']['capacidade'] && $convidadoDados['mesa_idmesa'] !== $convidado['dados']['mesa_idmesa']) {
                    throw new Exception('Mesa lotada', 409);
                }
            }

            $atualizar = $this->db->prepare('UPDATE convidado SET nome = :nome, sobrenome = :sobrenome, email = :email, cpf = :cpf, 
            categoria = :categoria, confirmacao = :confirmacao, telefone = :telefone, mesa_idmesa = :mesa_idmesa WHERE email = :email_convidado');

            $atualizar->execute([
                ':nome' => $convidadoDados['nome'],
                ':sobrenome' => $convidadoDados['sobrenome'],
                ':email' => $convidadoDados['email'],
                ':cpf' => $convidadoDados['cpf'],
                ':categoria' => $convidadoDados['categoria'],
                ':confirmacao' => $convidadoDados['confirmacao'],
                ':telefone' => $convidadoDados['telefone'],
                ':mesa_idmesa' => $convidadoDados['mesa_idmesa'],
                ':email_convidado' => $emailConvidado
            ]);

            return [
                'sucesso' => true,
                'mensagem' => 'Convidado atualizado com sucesso'
            ];
        } catch (PDOException $e) {
            if (str_contains($e->getMessage(), 'email')) {
                throw new Exception('Email já em uso', 409);
            }
            if (str_contains($e->getMessage(), 'cpf')) {
                throw new Exception('Cpf já em uso', 409);
            }

            if (str_contains($e->getMessage(), 'fk_convidado_mesa')) {
                throw new Exception('Mesa referenciada não encontrada', 404);
            }
            throw new Exception('Erro ao atualizar convidado', 500);
        }
    }


    public function deletarConvidado($emailConvidado)
    {
        try {

            $convidado = $this->buscarConvidadoPorEmail($emailConvidado);

            if ($convidado['sucesso'] === false) {
                throw new Exception($convidado['mensagem'], $convidado['codigo']);
            }

            $deletar = $this->db->prepare('DELETE FROM convidado WHERE email = :email');

            $deletar->execute([
                ':email' => $emailConvidado
            ]);

            return [
                'sucesso' => true,
                'mensagem' => 'Convidado deletado com sucesso'
            ];
        } catch (PDOException $e) {

            if (str_contains($e->getMessage(), 'parent row')) {
                throw new Exception('Não é possível deletar um convidado referenciado', 409);
            }
            throw new Exception('Erro ao deletar convidado', 500);
        }
    }
}
